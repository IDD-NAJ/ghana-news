
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Plus, Edit, Trash2, Eye, Calendar, Mail, Check, X, FileText, User, Clock } from 'lucide-react';
import { Input } from './ui/input';
import ArticleEditor from './ArticleEditor';
import ArticleViewDialog from './ArticleViewDialog';
import ContactMessages from './ContactMessages';
import BannerManager from './BannerManager';
import UserManagement from './UserManagement';
import { StoryReviewDialog } from './StoryReviewDialog';
import { AdManager } from './AdManager';

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

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  image_url: string | null;
  status: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  review_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [authorProfiles, setAuthorProfiles] = useState<{[key: string]: Profile}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [reviewingStory, setReviewingStory] = useState<Story | null>(null);
  const [showStoryReview, setShowStoryReview] = useState(false);
  const [activeTab, setActiveTab] = useState('stories');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    fetchArticles();
    fetchStories();
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

  const fetchStories = async () => {
    try {
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (storiesError) {
        console.error('Error fetching stories:', storiesError);
        return;
      }

      setStories(storiesData || []);

      // Fetch author profiles for stories
      if (storiesData && storiesData.length > 0) {
        const authorIds = [...new Set(storiesData.map(story => story.author_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', authorIds);

        if (!profilesError && profilesData) {
          const profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as {[key: string]: Profile});
          setAuthorProfiles(profilesMap);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
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

  const handleReviewStory = (story: Story) => {
    setReviewingStory(story);
    setShowStoryReview(true);
  };

  const handleStoryReviewClose = () => {
    setShowStoryReview(false);
    setReviewingStory(null);
    fetchStories();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'published':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Stories
              {stories.filter(s => s.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 text-xs">
                  {stories.filter(s => s.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="ads">Advertisements</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Stories Management</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {storiesLoading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>{stories.length} total stories</span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {storiesLoading ? (
                  <div className="text-center py-8">Loading stories...</div>
                ) : stories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No stories found. News anchors can submit stories for review.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stories.map((story) => {
                          const author = authorProfiles[story.author_id];
                          return (
                            <TableRow key={story.id}>
                              <TableCell className="font-medium max-w-xs truncate">
                                {story.title}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {author?.full_name || author?.email || 'Unknown'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{story.category}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(story.status)}
                                  <Badge className={getStatusColor(story.status)}>
                                    {story.status}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {formatDate(story.created_at)}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {formatDate(story.updated_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant={story.status === 'pending' ? 'default' : 'outline'}
                                    onClick={() => handleReviewStory(story)}
                                  >
                                    <Eye className="w-4 h-4" />
                                    {story.status === 'pending' ? 'Review' : 'View'}
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
          
          <TabsContent value="ads">
            <AdManager />
          </TabsContent>
          
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
          
          <TabsContent value="users">
            <UserManagement />
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

      {reviewingStory && (
        <StoryReviewDialog
          story={reviewingStory}
          onClose={handleStoryReviewClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
