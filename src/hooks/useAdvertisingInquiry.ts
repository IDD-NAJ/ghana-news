
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

  const submitInquiry = async (inquiryData: Omit<AdvertisingInquiry, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Submitting advertising inquiry:', inquiryData);
      
      // Using type assertion to work around TypeScript issue with new table
      const { data, error } = await (supabase as any)
        .from('advertising_inquiries')
        .insert({
          name: inquiryData.name.trim(),
          email: inquiryData.email.toLowerCase().trim(),
          company: inquiryData.company.trim(),
          phone: inquiryData.phone?.trim(),
          package_type: inquiryData.package_type,
          budget_range: inquiryData.budget_range,
          message: inquiryData.message.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Inquiry submission error:', error);
        setError('Failed to submit inquiry. Please try again.');
        return false;
      }

      console.log('Successfully submitted inquiry:', data);
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
    submitInquiry,
    loading,
    error,
    success,
    resetState
  };
};
