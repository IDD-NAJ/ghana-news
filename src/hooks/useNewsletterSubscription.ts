
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface NewsletterSubscription {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
  updated_at: string;
}

export const useNewsletterSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Attempting to subscribe email:', email);
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email.toLowerCase().trim(),
          subscribed: true
        })
        .select()
        .single();

      if (error) {
        // Handle duplicate email error
        if (error.code === '23505') {
          setError('This email is already subscribed to our newsletter.');
        } else {
          console.error('Subscription error:', error);
          setError('Failed to subscribe. Please try again.');
        }
        return false;
      }

      console.log('Successfully subscribed:', data);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    subscribe,
    loading,
    error,
    success,
    resetState
  };
};
