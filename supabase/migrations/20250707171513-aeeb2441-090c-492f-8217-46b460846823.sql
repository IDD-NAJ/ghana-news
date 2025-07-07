
-- First, let's drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all authenticated users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Access own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow access to own profile" ON public.profiles;

-- Create a security definer function to get current user's role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create simplified, non-recursive policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin');

-- Allow users to update their own profiles
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = auth.uid());

-- Allow profile creation (for new user signup)
CREATE POLICY "Allow profile creation" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (id = auth.uid());
