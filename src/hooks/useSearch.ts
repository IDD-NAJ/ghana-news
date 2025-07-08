
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Article } from './useArticles';

export const useSearch = (query: string) => {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const searchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Searching for:', query);
        
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            profiles!articles_author_id_fkey(
              full_name,
              email
            )
          `)
          .eq('published', true)
          .lte('publication_date', new Date().toISOString())
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
          .order('publication_date', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Search error:', error);
          setError(`Search failed: ${error.message}`);
          setResults([]);
          return;
        }

        console.log('Search results found:', data?.length || 0);
        
        // Transform the data to flatten the author information
        const resultsWithAuthor = (data || []).map((article: any) => ({
          ...article,
          author_name: article.profiles?.full_name || null,
          author_email: article.profiles?.email || null,
        }));
        
        setResults(resultsWithAuthor);
      } catch (err) {
        console.error('Unexpected search error:', err);
        setError('An unexpected error occurred during search');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timer = setTimeout(searchArticles, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error };
};
