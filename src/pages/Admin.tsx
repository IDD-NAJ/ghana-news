
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import AdminAuth from '../components/AdminAuth';
import AdminDashboard from '../components/AdminDashboard';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking initial auth status...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Failed to get session');
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        console.log('Found existing session for user:', session.user.id);
        await checkAdminStatus(session.user.id);
      } else {
        console.log('No existing session found');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError('Failed to check authentication status');
      setIsLoading(false);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // Add timeout with AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .abortSignal(controller.signal)
        .single();

      clearTimeout(timeoutId);
      console.log('Admin check result:', { data, error });

      if (error) {
        console.error('Profile error:', error);
        if (error.code === 'PGRST116') {
          setError('User profile not found. Please contact the system administrator to set up your admin profile.');
          await supabase.auth.signOut();
        } else if (error.name === 'AbortError') {
          setError('Admin check timed out. Please check your connection and try again.');
        } else {
          setError(`Failed to verify admin status: ${error.message}`);
        }
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (data?.role !== 'admin') {
        console.log('User is not an admin, role:', data?.role);
        setError('Access denied. Your account does not have admin privileges.');
        setIsAuthenticated(false);
        await supabase.auth.signOut();
      } else {
        console.log('User is admin, granting access');
        setIsAuthenticated(true);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error checking admin status:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Admin check timed out. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try refreshing the page.');
      }
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    console.log('Auth success callback triggered');
    setIsAuthenticated(true);
    setIsLoading(false);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    checkAuthStatus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg mb-2">Loading...</div>
          <div className="text-sm text-gray-600">Checking authentication status</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-lg text-red-600 mb-4">Error</div>
          <div className="text-sm text-gray-600 mb-6">{error}</div>
          <div className="space-y-3">
            <button 
              onClick={handleRetry}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <AdminDashboard />
  ) : (
    <AdminAuth onAuthSuccess={handleAuthSuccess} />
  );
};

export default Admin;
