
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Article } from './useArticles';

export const useTrendingArticles = (limit: number = 4) => {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        console.log('Fetching trending articles...');
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
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
          .order('publication_date', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Error fetching trending articles:', error);
          setError(`Failed to load trending articles: ${error.message}`);
          setTrendingArticles([]);
          return;
        }

        console.log('Successfully fetched trending articles:', data?.length || 0);
        
        // Transform the data to flatten the author information
        const articlesWithAuthor = (data || []).map((article: any) => ({
          ...article,
          author_name: article.profiles?.full_name || null,
          author_email: article.profiles?.email || null,
        }));
        
        setTrendingArticles(articlesWithAuthor);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading trending articles');
        setTrendingArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [limit]);

  return { trendingArticles, loading, error };
};
