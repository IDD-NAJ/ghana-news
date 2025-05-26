
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  author_id: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  publication_date: string;
  slug: string;
}

export const useArticles = (category?: string, featured?: boolean) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching articles with filters:', { category, featured });
        
        let query = supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .lte('publication_date', new Date().toISOString()) // Only show articles with publication date in the past
          .order('publication_date', { ascending: false }); // Order by publication date

        if (category) {
          query = query.eq('category', category);
        }

        if (featured !== undefined) {
          query = query.eq('featured', featured);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching articles:', error);
          setError(error.message);
          return;
        }

        console.log('Fetched articles:', data);
        setArticles(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, featured]);

  return { articles, loading, error };
};

export const useFeaturedArticle = () => {
  const { articles, loading, error } = useArticles(undefined, true);
  return { 
    featuredArticle: articles[0] || null, 
    loading, 
    error 
  };
};
