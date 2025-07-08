-- Create a roles reference table for better data integrity
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the standard roles used in the application
INSERT INTO public.roles (name, description) VALUES
  ('customer', 'Default user role with basic access'),
  ('news_anchor', 'Can submit stories for review'),
  ('chief_author', 'Can review and manage stories'),
  ('admin', 'Full system access and user management')
ON CONFLICT (name) DO NOTHING;

-- Add a check constraint to the profiles table to ensure only valid roles are used
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'profiles_role_check' 
               AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
    END IF;
    
    -- Add the new constraint
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('customer', 'news_anchor', 'chief_author', 'admin'));
END $$;

-- Create an index on the role column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update any existing invalid roles to 'customer' as the default
UPDATE public.profiles 
SET role = 'customer' 
WHERE role NOT IN ('customer', 'news_anchor', 'chief_author', 'admin');