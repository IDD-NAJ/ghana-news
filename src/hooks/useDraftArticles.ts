import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface DraftArticle {
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

export const useDraftArticles = () => {
  const [draftArticles, setDraftArticles] = useState<DraftArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDraftArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            profiles!articles_author_id_fkey(
              full_name,
              email
            )
          `)
          .eq('published', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching draft articles:', error);
          setError(`Failed to load draft articles: ${error.message}`);
          setDraftArticles([]);
          return;
        }

        console.log('Successfully fetched draft articles:', data?.length || 0);
        
        // Transform the data to flatten the author information
        const articlesWithAuthor = (data || []).map((article: any) => ({
          ...article,
          author_name: article.profiles?.full_name || null,
          author_email: article.profiles?.email || null,
        }));
        
        setDraftArticles(articlesWithAuthor);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading draft articles');
        setDraftArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDraftArticles();
  }, []);

  return { draftArticles, loading, error };
};