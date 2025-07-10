import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Globe, Rss } from "lucide-react";

interface NewsSource {
  id: string;
  name: string;
  url: string;
  rss_feed_url?: string;
  api_endpoint?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const NewsSourcesManager = () => {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    rss_feed_url: "",
    api_endpoint: "",
    active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    if (editingSource) {
      setFormData({
        name: editingSource.name,
        url: editingSource.url,
        rss_feed_url: editingSource.rss_feed_url || "",
        api_endpoint: editingSource.api_endpoint || "",
        active: editingSource.active
      });
    } else {
      setFormData({
        name: "",
        url: "",
        rss_feed_url: "",
        api_endpoint: "",
        active: true
      });
    }
  }, [editingSource]);

  const fetchSources = async () => {
    try {
      const { data, error } = await supabase
        .from("news_sources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSources(data || []);
    } catch (error: any) {
      console.error("Error fetching news sources:", error);
      toast({
        title: "Error",
        description: "Failed to load news sources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSource) {
        const { error } = await supabase
          .from("news_sources")
          .update({
            name: formData.name,
            url: formData.url,
            rss_feed_url: formData.rss_feed_url || null,
            api_endpoint: formData.api_endpoint || null,
            active: formData.active
          })
          .eq("id", editingSource.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News source updated successfully"
        });
      } else {
        const { error } = await supabase
          .from("news_sources")
          .insert([{
            name: formData.name,
            url: formData.url,
            rss_feed_url: formData.rss_feed_url || null,
            api_endpoint: formData.api_endpoint || null,
            active: formData.active
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News source created successfully"
        });
      }

      fetchSources();
      setIsDialogOpen(false);
      setEditingSource(null);
    } catch (error: any) {
      console.error("Error saving news source:", error);
      toast({
        title: "Error",
        description: "Failed to save news source",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news source?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("news_sources")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "News source deleted successfully"
      });

      fetchSources();
    } catch (error: any) {
      console.error("Error deleting news source:", error);
      toast({
        title: "Error",
        description: "Failed to delete news source",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (source: NewsSource) => {
    try {
      const { error } = await supabase
        .from("news_sources")
        .update({ active: !source.active })
        .eq("id", source.id);

      if (error) throw error;

      fetchSources();
      toast({
        title: "Success",
        description: `News source ${!source.active ? "activated" : "deactivated"}`
      });
    } catch (error: any) {
      console.error("Error toggling news source:", error);
      toast({
        title: "Error",
        description: "Failed to update news source",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading news sources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">News Sources</h2>
          <p className="text-muted-foreground">Manage news outlets for automated content fetching</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSource(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSource ? "Edit" : "Add"} News Source</DialogTitle>
              <DialogDescription>
                Configure a news outlet for automated content fetching via n8n
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Source Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., BBC News, CNN"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rss_feed">RSS Feed URL (Optional)</Label>
                <Input
                  id="rss_feed"
                  type="url"
                  value={formData.rss_feed_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, rss_feed_url: e.target.value }))}
                  placeholder="https://example.com/rss"
                />
              </div>
              
              <div>
                <Label htmlFor="api_endpoint">API Endpoint (Optional)</Label>
                <Input
                  id="api_endpoint"
                  type="url"
                  value={formData.api_endpoint}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_endpoint: e.target.value }))}
                  placeholder="https://api.example.com/news"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSource ? "Update" : "Create"} Source
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sources.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No news sources configured</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sources.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {source.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={source.active ? "default" : "secondary"}>
                        {source.active ? "Active" : "Inactive"}
                      </Badge>
                      {source.rss_feed_url && (
                        <Badge variant="outline">
                          <Rss className="h-3 w-3 mr-1" />
                          RSS
                        </Badge>
                      )}
                      {source.api_endpoint && (
                        <Badge variant="outline">API</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={source.active}
                      onCheckedChange={() => toggleActive(source)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSource(source);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(source.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <strong>Website:</strong>{" "}
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {source.url}
                    </a>
                  </div>
                  {source.rss_feed_url && (
                    <div>
                      <strong>RSS:</strong>{" "}
                      <a 
                        href={source.rss_feed_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {source.rss_feed_url}
                      </a>
                    </div>
                  )}
                  {source.api_endpoint && (
                    <div>
                      <strong>API:</strong> {source.api_endpoint}
                    </div>
                  )}
                  <div>
                    <strong>Created:</strong> {new Date(source.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};