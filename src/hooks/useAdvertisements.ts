import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string;
  ad_type: 'banner' | 'sidebar' | 'inline' | 'popup' | 'sponsored';
  placement_position: string | null;
  target_pages: string[];
  target_categories: string[];
  priority: number;
  active: boolean;
  start_date: string;
  end_date: string | null;
  click_count: number;
  impression_count: number;
  budget_spent: number;
  max_budget: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useAdvertisements = (
  adType?: string,
  placement?: string,
  currentPage?: string,
  category?: string
) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('priority', { ascending: false });

        if (adType) {
          query = query.eq('ad_type', adType);
        }

        if (placement) {
          query = query.eq('placement_position', placement);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching advertisements:', error);
          setError(`Failed to load advertisements: ${error.message}`);
          setAdvertisements([]);
          return;
        }

        // Filter by target pages and categories
        let filteredAds = data || [];
        
        if (currentPage || category) {
          filteredAds = filteredAds.filter(ad => {
            const matchesPage = !currentPage || 
              ad.target_pages.length === 0 || 
              ad.target_pages.includes(currentPage) ||
              ad.target_pages.includes('*'); // wildcard for all pages
            
            const matchesCategory = !category || 
              ad.target_categories.length === 0 || 
              ad.target_categories.includes(category);
            
            return matchesPage && matchesCategory;
          });
        }

        setAdvertisements(filteredAds as Advertisement[]);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading advertisements');
        setAdvertisements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [adType, placement, currentPage, category]);

  const trackAdInteraction = async (adId: string, type: 'view' | 'click', pageUrl?: string) => {
    try {
      await supabase.from('ad_interactions').insert({
        ad_id: adId,
        interaction_type: type,
        page_url: pageUrl || window.location.pathname,
        user_agent: navigator.userAgent,
      });

      // Update the ad's counters
      const updateField = type === 'view' ? 'impression_count' : 'click_count';
      const ad = advertisements.find(a => a.id === adId);
      if (ad) {
        await supabase
          .from('advertisements')
          .update({ [updateField]: ad[updateField] + 1 })
          .eq('id', adId);
      }
    } catch (error) {
      console.error('Error tracking ad interaction:', error);
    }
  };

  return { advertisements, loading, error, trackAdInteraction };
};