import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStories } from "@/hooks/useStories";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Clock, CheckCircle, XCircle, BarChart3, Edit, Eye, TrendingUp } from "lucide-react";
import { StoryEditor } from "@/components/StoryEditor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NewsAnchor = () => {
  const { profile, loading: authLoading } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const { stories, loading, createStory, updateStory } = useStories(profile?.id);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  console.log('NewsAnchor - Profile:', profile);
  console.log('NewsAnchor - User role:', profile?.role);
  console.log('NewsAnchor - User verified:', profile?.verified);

  if (!profile || profile.role !== 'news_anchor' || !profile.verified) {
    console.log('NewsAnchor - Redirecting to auth. Reason:', {
      noProfile: !profile,
      wrongRole: profile?.role !== 'news_anchor',
      notVerified: !profile?.verified
    });
    return <Navigate to="/auth" replace />;
  }

  // Calculate statistics
  const stats = {
    total: stories.length,
    pending: stories.filter(s => s.status === 'pending').length,
    approved: stories.filter(s => s.status === 'approved').length,
    published: stories.filter(s => s.status === 'published').length,
    rejected: stories.filter(s => s.status === 'rejected').length,
  };

  // Handle story save (create or update)
  const handleStorySave = async (storyData: any) => {
    if (editingStory) {
      return await updateStory(editingStory.id, storyData);
    } else {
      return await createStory(storyData);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">News Anchor Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {profile.full_name || profile.email}
              </p>
            </div>
            
            <Button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create New Story
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Stories</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.total > 0 ? Math.round(((stats.approved + stats.published) / stats.total) * 100) : 0}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stories Management */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Stories ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
              {stats.rejected > 0 && (
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading your stories...</div>
              ) : stories.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start creating your first story to share with the world.
                    </p>
                    <Button onClick={() => setShowEditor(true)}>
                      Create Your First Story
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {stories.map((story) => (
                    <Card key={story.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                            <p className="text-muted-foreground line-clamp-2">
                              {story.excerpt || story.content.substring(0, 150) + '...'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getStatusIcon(story.status)}
                            <Badge className={getStatusColor(story.status)}>
                              {story.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                          <span>Category: {story.category}</span>
                          <span>
                            Created: {new Date(story.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {story.review_notes && (
                          <div className="mb-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                              <strong>Review Notes:</strong> {story.review_notes}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {story.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingStory(story);
                                setShowEditor(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {['pending', 'approved', 'published', 'rejected'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                <div className="grid gap-4">
                  {stories
                    .filter(story => story.status === status)
                    .map((story) => (
                      <Card key={story.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                              <p className="text-muted-foreground line-clamp-2">
                                {story.excerpt || story.content.substring(0, 150) + '...'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {getStatusIcon(story.status)}
                              <Badge className={getStatusColor(story.status)}>
                                {story.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                            <span>Category: {story.category}</span>
                            <span>
                              Created: {new Date(story.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {story.review_notes && (
                            <div className="mb-4 p-3 bg-muted rounded-lg">
                              <p className="text-sm">
                                <strong>Review Notes:</strong> {story.review_notes}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {story.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingStory(story);
                                  setShowEditor(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {stories.filter(story => story.status === status).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No {status} stories found.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Story Editor Modal */}
      {showEditor && (
        <StoryEditor
          onClose={() => {
            setShowEditor(false);
            setEditingStory(null);
          }}
          onSave={handleStorySave}
          story={editingStory}
        />
      )}
    </div>
  );
};

export default NewsAnchor;