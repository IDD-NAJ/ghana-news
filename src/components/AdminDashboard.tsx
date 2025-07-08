
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Plus, Edit, Trash2, Eye, Calendar, Mail, Check, X } from 'lucide-react';
import { Input } from './ui/input';
import ArticleEditor from './ArticleEditor';
import ArticleViewDialog from './ArticleViewDialog';
import ContactMessages from './ContactMessages';
import BannerManager from './BannerManager';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  slug: string;
  created_at: string;
  updated_at: string;
  publication_date: string;
  author_id: string;
}

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('articles');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      setArticles(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleViewArticle = (article: Article) => {
    setViewingArticle(article);
    setShowViewDialog(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      return;
    }

    fetchArticles();
  };

  const handleEditCreatedDate = (articleId: string, currentDate: string) => {
    setEditingDate(articleId);
    // Format the date for the datetime-local input
    const date = new Date(currentDate);
    const formattedDate = date.toISOString().slice(0, 16);
    setTempDate(formattedDate);
  };

  const handleSaveCreatedDate = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          created_at: new Date(tempDate).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', articleId);

      if (error) {
        console.error('Error updating created date:', error);
        return;
      }

      setEditingDate(null);
      setTempDate('');
      fetchArticles();
    } catch (err) {
      console.error('Error updating date:', err);
    }
  };

  const handleCancelDateEdit = () => {
    setEditingDate(null);
    setTempDate('');
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingArticle(null);
    fetchArticles();
  };

  const handleViewDialogClose = () => {
    setShowViewDialog(false);
    setViewingArticle(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPublicationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isScheduled = date > now;
    
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return { formatted, isScheduled };
  };

  if (showEditor) {
    return <ArticleEditor article={editingArticle} onClose={handleEditorClose} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Button onClick={handleNewArticle} className="bg-ghana-green hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Articles Management</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading articles...</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No articles found. Create your first article!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Publication Date</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => {
                          const { formatted: pubDate, isScheduled } = formatPublicationDate(article.publication_date);
                          
                          return (
                            <TableRow key={article.id}>
                              <TableCell className="font-medium max-w-xs truncate">
                                {article.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{article.category}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={article.published ? "default" : "secondary"}>
                                  {article.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {article.featured && <Badge variant="default">Featured</Badge>}
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className={isScheduled ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                                    {pubDate}
                                  </span>
                                  {isScheduled && (
                                    <Badge variant="outline" className="text-xs">
                                      Scheduled
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {editingDate === article.id ? (
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="datetime-local"
                                      value={tempDate}
                                      onChange={(e) => setTempDate(e.target.value)}
                                      className="w-48"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleSaveCreatedDate(article.id)}
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleCancelDateEdit}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div 
                                    className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                    onClick={() => handleEditCreatedDate(article.id, article.created_at)}
                                  >
                                    {formatDate(article.created_at)}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {formatDate(article.updated_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewArticle(article)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditArticle(article)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteArticle(article.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="banners">
            <BannerManager />
          </TabsContent>
          
          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>
        </Tabs>
      </main>

      <ArticleViewDialog
        article={viewingArticle}
        open={showViewDialog}
        onClose={handleViewDialogClose}
      />
    </div>
  );
};

export default AdminDashboard;
