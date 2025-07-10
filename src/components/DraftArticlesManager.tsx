import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Eye, Calendar, Globe, User } from "lucide-react";

interface DraftArticle {
  id: string;
  source_id: string;
  original_url: string;
  original_title: string;
  original_content: string;
  paraphrased_title: string;
  paraphrased_content: string;
  paraphrased_excerpt: string;
  suggested_category: string;
  image_url: string;
  status: string;
  reviewed_by: string;
  reviewed_at: string;
  review_notes: string;
  created_at: string;
  updated_at: string;
  news_sources: {
    name: string;
    url: string;
  };
}

export const DraftArticlesManager = () => {
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<DraftArticle | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const { data, error } = await supabase
        .from("draft_articles")
        .select(`
          *,
          news_sources (
            name,
            url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDrafts(data || []);
    } catch (error: any) {
      console.error("Error fetching drafts:", error);
      toast({
        title: "Error",
        description: "Failed to load draft articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (draft: DraftArticle) => {
    if (!user) return;
    
    setProcessingId(draft.id);
    try {
      // Update draft status
      const { error } = await supabase
        .from("draft_articles")
        .update({
          status: "approved",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq("id", draft.id);

      if (error) throw error;

      // Send Telegram notification
      await supabase.functions.invoke("send-telegram-notification", {
        body: {
          draft_id: draft.id,
          action: "approved",
          title: draft.paraphrased_title,
          category: draft.suggested_category,
          reviewer_name: user.email
        }
      });

      toast({
        title: "Success",
        description: "Article approved and published successfully!"
      });

      fetchDrafts();
      setSelectedDraft(null);
      setReviewNotes("");
    } catch (error: any) {
      console.error("Error approving draft:", error);
      toast({
        title: "Error",
        description: "Failed to approve article",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (draft: DraftArticle) => {
    if (!user || !reviewNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide review notes for rejection",
        variant: "destructive"
      });
      return;
    }
    
    setProcessingId(draft.id);
    try {
      // Update draft status
      const { error } = await supabase
        .from("draft_articles")
        .update({
          status: "rejected",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq("id", draft.id);

      if (error) throw error;

      // Send Telegram notification
      await supabase.functions.invoke("send-telegram-notification", {
        body: {
          draft_id: draft.id,
          action: "rejected",
          title: draft.paraphrased_title,
          category: draft.suggested_category,
          reviewer_name: user.email
        }
      });

      toast({
        title: "Success",
        description: "Article rejected successfully"
      });

      fetchDrafts();
      setSelectedDraft(null);
      setReviewNotes("");
    } catch (error: any) {
      console.error("Error rejecting draft:", error);
      toast({
        title: "Error",
        description: "Failed to reject article",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, text: "Pending Review" },
      approved: { variant: "default" as const, text: "Approved" },
      rejected: { variant: "destructive" as const, text: "Rejected" },
      published: { variant: "default" as const, text: "Published" }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading draft articles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Draft Articles Review</h2>
        <Badge variant="outline">{drafts.length} Total Drafts</Badge>
      </div>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No draft articles found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{draft.paraphrased_title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>{draft.news_sources?.name || "Unknown Source"}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(draft.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(draft.status)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedDraft(draft);
                            setReviewNotes(draft.review_notes || "");
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Review Article</DialogTitle>
                          <DialogDescription>
                            Compare original and paraphrased content
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedDraft && (
                          <ScrollArea className="max-h-[70vh] pr-4">
                            <div className="space-y-6">
                              {/* Article Info */}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Globe className="h-4 w-4" />
                                  <span>{selectedDraft.news_sources?.name}</span>
                                </div>
                                <Badge variant="outline">{selectedDraft.suggested_category}</Badge>
                                {selectedDraft.reviewed_by && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>Reviewed</span>
                                  </div>
                                )}
                              </div>

                              {/* Paraphrased Version */}
                              <div>
                                <h3 className="font-semibold text-lg mb-2">Paraphrased Article</h3>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-3">
                                  <h4 className="font-medium text-green-900 dark:text-green-100">
                                    {selectedDraft.paraphrased_title}
                                  </h4>
                                  {selectedDraft.paraphrased_excerpt && (
                                    <p className="text-sm text-green-800 dark:text-green-200 italic">
                                      {selectedDraft.paraphrased_excerpt}
                                    </p>
                                  )}
                                  <div className="text-sm text-green-700 dark:text-green-300 max-h-40 overflow-y-auto">
                                    {selectedDraft.paraphrased_content.substring(0, 500)}...
                                  </div>
                                </div>
                              </div>

                              {/* Original Version */}
                              <div>
                                <h3 className="font-semibold text-lg mb-2">Original Article</h3>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                    {selectedDraft.original_title}
                                  </h4>
                                  <div className="text-sm text-blue-700 dark:text-blue-300 max-h-40 overflow-y-auto">
                                    {selectedDraft.original_content.substring(0, 500)}...
                                  </div>
                                  <a 
                                    href={selectedDraft.original_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    View Original Article →
                                  </a>
                                </div>
                              </div>

                              {/* Review Notes */}
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Review Notes {selectedDraft.status === "pending" && "(Required for rejection)"}
                                </label>
                                <Textarea
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add your review comments..."
                                  className="min-h-[100px]"
                                  disabled={selectedDraft.status !== "pending"}
                                />
                              </div>

                              {/* Action Buttons */}
                              {selectedDraft.status === "pending" && (
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button
                                    onClick={() => handleApprove(selectedDraft)}
                                    disabled={processingId === selectedDraft.id}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {processingId === selectedDraft.id ? "Processing..." : "Approve & Publish"}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleReject(selectedDraft)}
                                    disabled={processingId === selectedDraft.id || !reviewNotes.trim()}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {draft.paraphrased_excerpt || draft.paraphrased_content.substring(0, 150) + "..."}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{draft.suggested_category}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {new Date(draft.created_at).toLocaleString()}
                    </div>
                  </div>

                  {draft.review_notes && (
                    <div className="text-xs bg-muted p-2 rounded">
                      <strong>Review Notes:</strong> {draft.review_notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};