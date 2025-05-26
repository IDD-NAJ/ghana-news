
import React, { useState, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ImageUploadItem {
  id?: string;
  file?: File;
  url: string;
  caption: string;
  display_order: number;
  isUploading?: boolean;
  isNew?: boolean;
}

interface ImageUploaderProps {
  articleId?: string;
  images: ImageUploadItem[];
  onImagesChange: (images: ImageUploadItem[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ articleId, images, onImagesChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageUploadItem[] = [];
    const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.display_order)) : -1;

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newImages.push({
          file,
          url,
          caption: '',
          display_order: maxOrder + index + 1,
          isNew: true
        });
      }
    });

    onImagesChange([...images, ...newImages]);
    event.target.value = '';
  }, [images, onImagesChange]);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const saveImageToDatabase = async (imageUrl: string, caption: string, displayOrder: number) => {
    if (!articleId) return;

    const { error } = await supabase
      .from('article_images')
      .insert({
        article_id: articleId,
        image_url: imageUrl,
        caption,
        display_order: displayOrder
      });

    if (error) throw error;
  };

  const uploadPendingImages = async () => {
    if (!articleId) return;

    setIsUploading(true);
    setError('');

    try {
      const updatedImages = [...images];

      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];
        if (image.isNew && image.file) {
          try {
            const uploadedUrl = await uploadImage(image.file);
            await saveImageToDatabase(uploadedUrl, image.caption, image.display_order);
            
            // Update the image with the uploaded URL and remove the file
            updatedImages[i] = {
              ...image,
              url: uploadedUrl,
              file: undefined,
              isNew: false,
              isUploading: false
            };
          } catch (err) {
            console.error('Error uploading image:', err);
            setError(`Failed to upload image: ${image.file.name}`);
          }
        }
      }

      onImagesChange(updatedImages);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = useCallback(async (index: number) => {
    const imageToRemove = images[index];
    
    // If it's an existing image in the database, delete it
    if (imageToRemove.id && articleId) {
      try {
        const { error } = await supabase
          .from('article_images')
          .delete()
          .eq('id', imageToRemove.id);

        if (error) {
          console.error('Error deleting image from database:', error);
          setError('Failed to delete image');
          return;
        }
      } catch (err) {
        console.error('Error deleting image:', err);
        setError('Failed to delete image');
        return;
      }
    }

    // Remove from local state
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  }, [images, onImagesChange, articleId]);

  const updateCaption = useCallback((index: number, caption: string) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], caption };
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    // Update display orders
    updatedImages.forEach((image, index) => {
      image.display_order = index;
    });
    
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const hasNewImages = images.some(img => img.isNew);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Article Images</h3>
        {hasNewImages && articleId && (
          <Button 
            onClick={uploadPendingImages} 
            disabled={isUploading}
            size="sm"
            className="bg-ghana-green hover:bg-green-700"
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Click to upload images or drag and drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {image.isNew && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        New
                      </span>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-3 space-y-2">
                  <Input
                    placeholder="Image caption (optional)"
                    value={image.caption}
                    onChange={(e) => updateCaption(index, e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Order:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => index > 0 && moveImage(index, index - 1)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <span className="text-sm">{index + 1}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => index < images.length - 1 && moveImage(index, index + 1)}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </Button>
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

export default ImageUploader;
