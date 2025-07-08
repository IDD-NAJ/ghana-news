import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStories } from "@/hooks/useStories";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Eye, FileText, Clock, Send, Plus } from "lucide-react";
import { StoryReviewDialog } from "@/components/StoryReviewDialog";
import { QuickArticleEditor } from "@/components/QuickArticleEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ChiefAuthor = () => {
  const { profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [publishingStory, setPublishingStory] = useState<string | null>(null);
  const { stories: pendingStories, loading: pendingLoading } = useStories(undefined, 'pending');
  const { stories: allStories, loading: allLoading } = useStories();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile || (profile.role !== 'chief_author' && profile.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
  }

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

  const handleQuickPublish = async (story: any) => {
    setPublishingStory(story.id);

    try {
      const updates = {
        status: 'approved',
        reviewed_by: profile?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: 'Quick publish by chief author'
      };

      const { error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', story.id);

      if (error) throw error;

      toast({
        title: "Story published",
        description: "Story has been published successfully.",
      });

      // Refresh the page to update the lists
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish story",
        variant: "destructive"
      });
    } finally {
      setPublishingStory(null);
    }
  };

  const renderStoryCard = (story: any) => (
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
            Submitted: {new Date(story.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedStory(story)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Review
          </Button>
          
          {story.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => handleQuickPublish(story)}
              disabled={publishingStory === story.id}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              {publishingStory === story.id ? 'Publishing...' : 'Quick Publish'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Chief Author Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Review submissions and create new articles
              </p>
            </div>
            
            <Button 
              onClick={() => setShowArticleEditor(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Article
            </Button>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pending Review ({pendingStories.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Stories ({allStories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-6">
                {pendingLoading ? (
                  <div className="text-center py-8">Loading pending stories...</div>
                ) : pendingStories.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No pending stories</h3>
                      <p className="text-muted-foreground">
                        All stories have been reviewed.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingStories.map(renderStoryCard)
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6">
                {allLoading ? (
                  <div className="text-center py-8">Loading all stories...</div>
                ) : allStories.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
                      <p className="text-muted-foreground">
                        No stories have been submitted yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  allStories.map(renderStoryCard)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Story Review Modal */}
      {selectedStory && (
        <StoryReviewDialog
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* Article Editor Modal */}
      {showArticleEditor && (
        <QuickArticleEditor
          onClose={() => setShowArticleEditor(false)}
        />
      )}
    </div>
  );
};

export default ChiefAuthor;