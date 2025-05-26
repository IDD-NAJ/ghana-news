
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, X } from 'lucide-react';

interface FeaturedImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onError: (error: string) => void;
}

const FeaturedImageUploader: React.FC<FeaturedImageUploaderProps> = ({
  imageUrl,
  onImageUrlChange,
  onError
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    onError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `featured-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) {
        onError('Failed to upload featured image');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      onImageUrlChange(publicUrl);
    } catch (err) {
      console.error('Error uploading featured image:', err);
      onError('Failed to upload featured image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
    event.target.value = '';
  };

  const removeImage = () => {
    onImageUrlChange('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image URL (Legacy)
      </label>
      <div className="space-y-3">
        <Input
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Or upload an image:</span>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="featured-image-upload"
              disabled={isUploading}
            />
            <label htmlFor="featured-image-upload">
              <Button
                variant="outline"
                size="sm"
                disabled={isUploading}
                asChild
              >
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </span>
              </Button>
            </label>
            {imageUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Featured image preview"
              className="w-full h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Use the Images section above for better image management
      </p>
    </div>
  );
};

export default FeaturedImageUploader;
