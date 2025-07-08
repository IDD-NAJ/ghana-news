import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  status: string;
  category: string;
  image_url: string | null;
  slug: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useStories = (authorId?: string, status?: string) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (authorId) {
          query = query.eq('author_id', authorId);
        }

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching stories:', error);
          setError(`Failed to load stories: ${error.message}`);
          setStories([]);
          return;
        }

        setStories(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading stories');
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [authorId, status]);

  const createStory = async (storyData: Omit<Story, 'id' | 'created_at' | 'updated_at' | 'reviewed_by' | 'reviewed_at' | 'review_notes'>) => {
    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    setStories(prev => [data, ...prev]);
    return data;
  };

  const updateStory = async (id: string, updates: Partial<Story>) => {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setStories(prev => prev.map(story => story.id === id ? data : story));
    return data;
  };

  const deleteStory = async (id: string) => {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    setStories(prev => prev.filter(story => story.id !== id));
  };

  return { stories, loading, error, createStory, updateStory, deleteStory };
};