import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Send, Eye } from "lucide-react";

interface StoryReviewDialogProps {
  story: any;
  onClose: () => void;
}

export const StoryReviewDialog = ({ story, onClose }: StoryReviewDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(story.review_notes || '');

  const handleReview = async (action: 'approved' | 'rejected' | 'published') => {
    setIsLoading(true);

    try {
      const updates = {
        status: action,
        reviewed_by: profile?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes
      };

      const { error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', story.id);

      if (error) throw error;

      toast({
        title: "Story updated",
        description: `Story has been ${action}.`,
      });

      onClose();
      window.location.reload(); // Refresh to update the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update story",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectPublish = async () => {
    setIsLoading(true);

    try {
      // First approve the story, then publish it
      const updates = {
        status: 'approved',
        reviewed_by: profile?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes || 'Direct publish by chief author'
      };

      const { error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', story.id);

      if (error) throw error;

      toast({
        title: "Story published",
        description: "Story has been approved and published directly.",
      });

      onClose();
      window.location.reload(); // Refresh to update the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish story",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Review Story</span>
            <Badge className={getStatusColor(story.status)}>
              {story.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Story Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{story.title}</h3>
              <p className="text-muted-foreground">
                Category: {story.category} | 
                Submitted: {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>

            {story.excerpt && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Excerpt:</h4>
                <p>{story.excerpt}</p>
              </div>
            )}

            {story.image_url && (
              <div>
                <h4 className="font-semibold mb-2">Featured Image:</h4>
                <img 
                  src={story.image_url} 
                  alt="Story featured image"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Content:</h4>
              <div className="p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
                <div className="whitespace-pre-wrap">{story.content}</div>
              </div>
            </div>
          </div>

          {/* Review Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Review Notes</label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes about your review decision..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>

            <div className="flex gap-2">
              {story.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleReview('rejected')}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview('approved')}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={handleDirectPublish}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                    Publish Now
                  </Button>
                </>
              )}

              {story.status === 'approved' && (
                <Button
                  onClick={() => handleReview('published')}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};