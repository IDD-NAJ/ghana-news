import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStories } from "@/hooks/useStories";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { StoryEditor } from "@/components/StoryEditor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NewsAnchor = () => {
  const { profile, loading: authLoading } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const { stories, loading, createStory, updateStory } = useStories(profile?.id);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile || profile.role !== 'news_anchor' || !profile.verified) {
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

          {/* Stories Grid */}
          <div className="grid gap-6">
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
              stories.map((story) => (
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
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Category: {story.category}</span>
                      <span>
                        Created: {new Date(story.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {story.review_notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Review Notes:</strong> {story.review_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Story Editor Modal */}
      {showEditor && (
        <StoryEditor
          onClose={() => setShowEditor(false)}
          onSave={createStory}
        />
      )}
    </div>
  );
};

export default NewsAnchor;