
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
      return;
    }

    const searchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Searching for:', query);
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .lte('publication_date', new Date().toISOString())
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
          .order('publication_date', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Search error:', error);
          setError(error.message);
          return;
        }

        console.log('Search results:', data);
        setResults(data || []);
      } catch (err) {
        console.error('Unexpected search error:', err);
        setError('Failed to search articles');
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
