import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';

interface AdImageUploaderProps {
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
}

export const AdImageUploader = ({ currentImageUrl, onImageUrlChange }: AdImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `ads/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(data.path);

      onImageUrlChange(publicUrl);
      setUrlInput(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    onImageUrlChange(url);
  };

  const clearImage = () => {
    setUrlInput('');
    onImageUrlChange('');
  };

  return (
    <div className="space-y-4">
      <Label>Advertisement Image</Label>
      
      {/* Image preview */}
      {(currentImageUrl || urlInput) && (
        <div className="relative inline-block">
          <img 
            src={currentImageUrl || urlInput} 
            alt="Advertisement preview" 
            className="max-w-xs max-h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload button */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="ad-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="relative"
            asChild
          >
            <label htmlFor="ad-image-upload" className="cursor-pointer">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </label>
          </Button>
        </div>
        
        <span className="text-muted-foreground text-sm">or</span>
        
        <div className="flex-1 min-w-0">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={urlInput}
            onChange={handleUrlChange}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Upload an image (JPEG, PNG, WebP, max 5MB) or enter an image URL
      </p>
    </div>
  );
};