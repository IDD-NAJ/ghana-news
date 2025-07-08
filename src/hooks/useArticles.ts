
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
  author_name: string | null;
  author_email: string | null;
}

export const useArticles = (category?: string, featured?: boolean) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching articles with filters:', { category, featured });
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('articles')
          .select(`
            *,
            profiles(
              full_name,
              email
            )
          `)
          .eq('published', true)
          .lte('publication_date', new Date().toISOString())
          .order('publication_date', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        if (featured !== undefined) {
          query = query.eq('featured', featured);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching articles:', error);
          setError(`Failed to load articles: ${error.message}`);
          setArticles([]);
          return;
        }

        console.log('Successfully fetched articles:', data?.length || 0);
        
        // Transform the data to flatten the author information
        const articlesWithAuthor = (data || []).map((article: any) => ({
          ...article,
          author_name: article.profiles?.full_name || null,
          author_email: article.profiles?.email || null,
        }));
        
        setArticles(articlesWithAuthor);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading articles');
        setArticles([]);
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
