import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Send, X, Upload } from "lucide-react";

interface QuickArticleEditorProps {
  onClose: () => void;
}

const categories = [
  "Politics",
  "Business", 
  "Technology",
  "Sports",
  "Entertainment",
  "Culture",
  "Education",
  "Lifestyle",
  "Opinion"
];

export const QuickArticleEditor = ({ onClose }: QuickArticleEditorProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [article, setArticle] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image_url: "",
    featured: false
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      setArticle(prev => ({ ...prev, image_url: data.publicUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Featured image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (publishNow: boolean = false) => {
    if (!article.title.trim() || !article.content.trim() || !article.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in title, content, and category.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const slug = generateSlug(article.title);
      const now = new Date().toISOString();

      const articleData = {
        title: article.title.trim(),
        excerpt: article.excerpt.trim() || null,
        content: article.content.trim(),
        category: article.category,
        image_url: article.image_url || null,
        slug,
        author_id: profile?.id,
        featured: article.featured,
        published: publishNow,
        publication_date: now,
        created_at: now,
        updated_at: now
      };

      const { error } = await supabase
        .from('articles')
        .insert([articleData]);

      if (error) throw error;

      toast({
        title: publishNow ? "Article published" : "Article saved",
        description: publishNow 
          ? "Your article has been published successfully." 
          : "Your article has been saved as a draft.",
      });

      onClose();
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New Article</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={article.title}
              onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter article title..."
              className="text-lg"
            />
          </div>

          {/* Category and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select 
                value={article.category} 
                onValueChange={(value) => setArticle(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Featured Article</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={article.featured}
                  onCheckedChange={(checked) => setArticle(prev => ({ ...prev, featured: checked }))}
                />
                <span className="text-sm text-muted-foreground">
                  Mark as featured on homepage
                </span>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={article.excerpt}
              onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the article (optional)..."
              rows={3}
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={imageUploading}
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {article.image_url && (
                <div className="relative">
                  <img 
                    src={article.image_url} 
                    alt="Featured image preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setArticle(prev => ({ ...prev, image_url: "" }))}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={article.content}
              onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your article content here..."
              rows={15}
              className="min-h-[300px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              <Button
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Publish Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};