import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  full_name: string | null;
  bio: string | null;
  expertise_areas: string[] | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isAdmin: () => boolean;
  isChiefAuthor: () => boolean;
  isNewsAnchor: () => boolean;
  canManageStories: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile fetch result:', { profileData, error });

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else if (profileData) {
        console.log('Profile found:', profileData);
        setProfile(profileData);
      } else {
        console.log('No profile found for user:', userId);
        // Create a profile if it doesn't exist
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setProfile(null);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      console.log('Creating profile for user:', userId);
      
      // Get user data from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error('No auth user found');
        return;
      }

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: authUser.email || '',
          role: 'customer',
          verified: false,
          full_name: authUser.user_metadata?.full_name || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        setProfile(null);
      } else {
        console.log('Profile created:', newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log('Setting up auth listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    console.log('Signing out...');
    
    // Check if there's a valid session before attempting to sign out
    if (!session) {
      console.log('No session found, clearing local state only');
      // Clear local state even if no session
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    console.log('Sign out result:', { error });
    
    // Clear local state regardless of the sign out result
    // This handles cases where session is invalid but we still need to clear UI state
    if (!error || error.message?.includes('Auth session missing')) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null }; // Treat session missing as successful sign out
    }
    
    return { error };
  };

  const isAdmin = () => profile?.role === 'admin';
  const isChiefAuthor = () => profile?.role === 'chief_author';
  const isNewsAnchor = () => profile?.role === 'news_anchor' && profile?.verified;
  const canManageStories = () => isAdmin() || isChiefAuthor();

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isChiefAuthor,
    isNewsAnchor,
    canManageStories
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};