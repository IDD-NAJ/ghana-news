import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface AdFormData {
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  link_text: string;
  ad_type: 'banner' | 'sidebar' | 'inline' | 'popup' | 'sponsored';
  placement_position: string;
  target_pages: string;
  target_categories: string;
  priority: number;
  active: boolean;
  start_date: string;
  end_date: string;
  max_budget: number;
}

export const AdManager = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    link_text: 'Learn More',
    ad_type: 'banner',
    placement_position: '',
    target_pages: '',
    target_categories: '',
    priority: 1,
    active: true,
    start_date: '',
    end_date: '',
    max_budget: 0,
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAdvertisements();
    }
  }, [profile]);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvertisements(data as Advertisement[] || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch advertisements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adData = {
        ...formData,
        target_pages: formData.target_pages.split(',').map(p => p.trim()).filter(Boolean),
        target_categories: formData.target_categories.split(',').map(c => c.trim()).filter(Boolean),
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : new Date().toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        max_budget: formData.max_budget || null,
        created_by: profile?.id,
      };

      let result;
      if (editingAd) {
        result = await supabase
          .from('advertisements')
          .update(adData)
          .eq('id', editingAd.id);
      } else {
        result = await supabase
          .from('advertisements')
          .insert([adData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Advertisement ${editingAd ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingAd(null);
      resetForm();
      fetchAdvertisements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save advertisement",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      link_text: ad.link_text,
      ad_type: ad.ad_type,
      placement_position: ad.placement_position || '',
      target_pages: ad.target_pages.join(', '),
      target_categories: ad.target_categories.join(', '),
      priority: ad.priority,
      active: ad.active,
      start_date: ad.start_date ? new Date(ad.start_date).toISOString().slice(0, 16) : '',
      end_date: ad.end_date ? new Date(ad.end_date).toISOString().slice(0, 16) : '',
      max_budget: ad.max_budget || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', adId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Advertisement deleted successfully",
      });

      fetchAdvertisements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete advertisement",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      link_text: 'Learn More',
      ad_type: 'banner',
      placement_position: '',
      target_pages: '',
      target_categories: '',
      priority: 1,
      active: true,
      start_date: '',
      end_date: '',
      max_budget: 0,
    });
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'banner': return 'bg-blue-100 text-blue-800';
      case 'sidebar': return 'bg-green-100 text-green-800';
      case 'inline': return 'bg-purple-100 text-purple-800';
      case 'popup': return 'bg-orange-100 text-orange-800';
      case 'sponsored': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Advertisement Manager</h1>
          <p className="text-muted-foreground">Manage advertisements across your site</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingAd(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Advertisement
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="ad_type">Ad Type</Label>
                  <Select
                    value={formData.ad_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ad_type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="sponsored">Sponsored Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link_text">Link Text</Label>
                  <Input
                    id="link_text"
                    value={formData.link_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, link_text: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="placement_position">Placement Position</Label>
                  <Input
                    id="placement_position"
                    value={formData.placement_position}
                    onChange={(e) => setFormData(prev => ({ ...prev, placement_position: e.target.value }))}
                    placeholder="top, bottom, left, right, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_pages">Target Pages (comma-separated)</Label>
                  <Input
                    id="target_pages"
                    value={formData.target_pages}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_pages: e.target.value }))}
                    placeholder="/, /sports, /technology"
                  />
                </div>
                
                <div>
                  <Label htmlFor="target_categories">Target Categories (comma-separated)</Label>
                  <Input
                    id="target_categories"
                    value={formData.target_categories}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_categories: e.target.value }))}
                    placeholder="sports, technology, business"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_budget">Max Budget ($)</Label>
                  <Input
                    id="max_budget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.max_budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_budget: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAd ? 'Update' : 'Create'} Advertisement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading advertisements...</div>
      ) : (
        <div className="grid gap-4">
          {advertisements.map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ad.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getAdTypeColor(ad.ad_type)}>
                        {ad.ad_type}
                      </Badge>
                      <Badge variant={ad.active ? "default" : "secondary"}>
                        {ad.active ? "Active" : "Inactive"}
                      </Badge>
                      {ad.placement_position && (
                        <Badge variant="outline">
                          {ad.placement_position}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ad)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ad.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {ad.description && (
                  <p className="text-muted-foreground mb-4">{ad.description}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.impression_count} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.click_count} clicks</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span> {ad.priority}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span> ${ad.budget_spent.toFixed(2)} / ${ad.max_budget?.toFixed(2) || '∞'}
                  </div>
                </div>
                
                {(ad.target_pages.length > 0 || ad.target_categories.length > 0) && (
                  <div className="mt-4 pt-4 border-t">
                    {ad.target_pages.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Target Pages:</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {ad.target_pages.join(', ')}
                        </span>
                      </div>
                    )}
                    {ad.target_categories.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Target Categories:</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {ad.target_categories.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {advertisements.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No advertisements created yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};