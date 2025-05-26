
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface ArticleImage {
  id: string;
  article_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export const useArticleImages = (articleId?: string) => {
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) {
      setImages([]);
      return;
    }

    fetchImages();
  }, [articleId]);

  const fetchImages = async () => {
    if (!articleId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', articleId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching article images:', error);
        setError(error.message);
        return;
      }

      setImages(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const updateImageOrder = async (imageId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('article_images')
        .update({ display_order: newOrder })
        .eq('id', imageId);

      if (error) {
        console.error('Error updating image order:', error);
        return false;
      }

      // Refresh images
      await fetchImages();
      return true;
    } catch (err) {
      console.error('Error updating image order:', err);
      return false;
    }
  };

  const updateImageCaption = async (imageId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('article_images')
        .update({ caption })
        .eq('id', imageId);

      if (error) {
        console.error('Error updating image caption:', error);
        return false;
      }

      // Update local state
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, caption } : img
      ));
      return true;
    } catch (err) {
      console.error('Error updating image caption:', err);
      return false;
    }
  };

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
    updateImageOrder,
    updateImageCaption
  };
};
