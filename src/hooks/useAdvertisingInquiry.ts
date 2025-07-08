
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface AdvertisingInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  package_type: string;
  budget_range: string;
  message: string;
  created_at: string;
}

export const useAdvertisingInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitInquiry = async (inquiryData: Omit<AdvertisingInquiry, 'id' | 'created_at'>, retryCount = 0) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Submitting advertising inquiry:', inquiryData);
      
      const { data, error } = await supabase
        .from('advertising_inquiries')
        .insert({
          name: inquiryData.name.trim(),
          email: inquiryData.email.toLowerCase().trim(),
          company: inquiryData.company.trim(),
          phone: inquiryData.phone?.trim() || null,
          package_type: inquiryData.package_type,
          budget_range: inquiryData.budget_range || null,
          message: inquiryData.message.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Inquiry submission error:', error);
        
        // Handle specific error cases
        if (error.code === 'PGRST301' && retryCount < 2) {
          console.log(`Retrying submission (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return submitInquiry(inquiryData, retryCount + 1);
        }
        
        setError('Failed to submit inquiry. Please check your connection and try again.');
        return false;
      }

      console.log('Successfully submitted inquiry:', data);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      
      // Handle network errors with retry
      if ((err instanceof Error && err.message.includes('Failed to fetch')) && retryCount < 2) {
        console.log(`Retrying due to network error (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return submitInquiry(inquiryData, retryCount + 1);
      }
      
      setError('Connection error. Please check your internet connection and try again.');
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
    submitInquiry,
    loading,
    error,
    success,
    resetState
  };
};
