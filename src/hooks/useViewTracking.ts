
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useViewTracking = (articleId: string | undefined) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!articleId) return;

    // Fetch current view count
    const fetchViewCount = async () => {
      try {
        const { data, error } = await supabase
          .from('article_view_counts')
          .select('total_views')
          .eq('article_id', articleId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching view count:', error);
          setViewCount(0);
        } else {
          setViewCount(data?.total_views || 0);
        }
      } catch (err) {
        console.error('Unexpected error fetching view count:', err);
        setViewCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchViewCount();
  }, [articleId]);

  useEffect(() => {
    if (!articleId || hasTracked) return;

    const trackView = async () => {
      try {
        // Get client IP and user agent
        const userAgent = navigator.userAgent;
        
        // Insert view record
        const { error: viewError } = await supabase
          .from('article_views')
          .insert({
            article_id: articleId,
            user_agent: userAgent,
            viewed_at: new Date().toISOString()
          });

        if (viewError) {
          console.error('Error tracking view:', viewError);
          return;
        }

        // Update view count
        setViewCount(prev => prev + 1);
        setHasTracked(true);
      } catch (err) {
        console.error('Unexpected error tracking view:', err);
      }
    };

    // Track view after a short delay to ensure user actually viewed the article
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [articleId, hasTracked]);

  return { viewCount, loading };
};
