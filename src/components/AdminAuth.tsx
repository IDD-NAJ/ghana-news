
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login for:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        if (error.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please check your credentials or sign up if you don\'t have an account yet.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (!data.user) {
        setError('No user data received');
        return;
      }

      // Check if user is admin
      console.log('Checking admin status for user:', data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      console.log('Profile response:', { profile, profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        if (profileError.code === 'PGRST116') {
          setError('User profile not found. Please contact the system administrator to set up your admin profile.');
        } else {
          setError('Failed to verify admin status: ' + profileError.message);
        }
        await supabase.auth.signOut();
        return;
      }

      if (profile.role !== 'admin') {
        setError('Access denied. Your account exists but does not have admin privileges. Please contact the system administrator to grant admin access to your account.');
        await supabase.auth.signOut();
        return;
      }

      console.log('Admin login successful');
      onAuthSuccess();
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting signup for:', email);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        return;
      }

      if (data.user) {
        console.log('Signup successful for user:', data.user.id);
        setError('Account created successfully! Please contact the system administrator to grant admin privileges to your account, then you can log in.');
        setIsSignUp(false);
        // Clear the form
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError('An unexpected error occurred during signup: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Admin Sign Up' : 'Admin Login'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Create an account to request admin access' 
              : 'Sign in to access the admin dashboard'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {error && (
              <Alert variant={error.includes('successfully') ? "default" : "destructive"}>
                <AlertDescription className="text-sm leading-relaxed">{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-ghana-red hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
                : (isSignUp ? 'Sign Up' : 'Sign In')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-ghana-red hover:text-red-700 underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>First time here?</strong> You'll need to sign up first, then contact the system administrator to grant admin privileges to your account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
