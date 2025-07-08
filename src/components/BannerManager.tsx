import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface BannerItem {
  id: string;
  type: 'breaking' | 'announcement' | 'alert';
  title: string;
  message: string;
  link?: string;
  link_text?: string;
  priority: 'high' | 'medium' | 'low';
  active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

const BannerManager = () => {
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);
  const [formData, setFormData] = useState<{
    type: 'breaking' | 'announcement' | 'alert';
    title: string;
    message: string;
    link: string;
    link_text: string;
    priority: 'high' | 'medium' | 'low';
    active: boolean;
    expires_at: string;
  }>({
    type: 'announcement',
    title: '',
    message: '',
    link: '',
    link_text: '',
    priority: 'medium',
    active: true,
    expires_at: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBannerItems();
  }, []);

  const fetchBannerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching banner items:', error);
        toast({
          title: "Error",
          description: "Failed to fetch banner items",
          variant: "destructive"
        });
        return;
      }

      setBannerItems(data as BannerItem[] || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        expires_at: formData.expires_at || null,
        link: formData.link || null,
        link_text: formData.link_text || null
      };

      if (editingItem) {
        const { error } = await supabase
          .from('banner_items')
          .update(submitData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Banner item updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('banner_items')
          .insert([submitData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Banner item created successfully"
        });
      }

      fetchBannerItems();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving banner item:', error);
      toast({
        title: "Error",
        description: "Failed to save banner item",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: BannerItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      message: item.message,
      link: item.link || '',
      link_text: item.link_text || '',
      priority: item.priority,
      active: item.active,
      expires_at: item.expires_at ? new Date(item.expires_at).toISOString().slice(0, 16) : ''
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner item?')) return;

    try {
      const { error } = await supabase
        .from('banner_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner item deleted successfully"
      });
      fetchBannerItems();
    } catch (error) {
      console.error('Error deleting banner item:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner item",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'announcement',
      title: '',
      message: '',
      link: '',
      link_text: '',
      priority: 'medium',
      active: true,
      expires_at: ''
    });
    setEditingItem(null);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Banner Management</CardTitle>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-ghana-green hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Banner Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Banner Item' : 'Create New Banner Item'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breaking">Breaking News</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter banner title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Enter banner message"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="link">Link (optional)</Label>
                    <Input
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      placeholder="Enter link URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link_text">Link Text (optional)</Label>
                    <Input
                      value={formData.link_text}
                      onChange={(e) => setFormData({...formData, link_text: e.target.value})}
                      placeholder="Enter link text"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expires_at">Expires At (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading banner items...</div>
        ) : bannerItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No banner items found. Create your first banner item!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bannerItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                    <TableCell>
                      <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.active ? 'default' : 'secondary'}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.expires_at ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.expires_at)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BannerManager;