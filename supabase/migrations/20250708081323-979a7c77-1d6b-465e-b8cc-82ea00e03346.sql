-- Create new user roles enum
CREATE TYPE app_user_role AS ENUM ('admin', 'chief_author', 'news_anchor', 'user');

-- Add new columns first
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS expertise_areas TEXT[],
ADD COLUMN IF NOT EXISTS new_role app_user_role DEFAULT 'user';

-- Update the new role column based on existing role
UPDATE public.profiles SET new_role = 'admin' WHERE role = 'admin';
UPDATE public.profiles SET new_role = 'user' WHERE role != 'admin';

-- Drop the old role column and rename the new one
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN new_role TO role;

-- Create stories table for news anchor submissions
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
    category TEXT NOT NULL,
    image_url TEXT,
    slug TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on stories table
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Update the get_current_user_role function to work with new enum
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_user_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- RLS policies for stories
CREATE POLICY "News anchors can view their own stories" 
ON public.stories 
FOR SELECT 
USING (author_id = auth.uid() OR get_current_user_role() IN ('admin', 'chief_author'));

CREATE POLICY "Verified news anchors can create stories" 
ON public.stories 
FOR INSERT 
WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'news_anchor' 
        AND verified = true
    )
);

CREATE POLICY "News anchors can update their pending stories" 
ON public.stories 
FOR UPDATE 
USING (
    author_id = auth.uid() AND status = 'pending'
    OR get_current_user_role() IN ('admin', 'chief_author')
);

CREATE POLICY "Admins and chief authors can manage all stories" 
ON public.stories 
FOR ALL 
USING (get_current_user_role() IN ('admin', 'chief_author'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON public.stories
    FOR EACH ROW
    EXECUTE FUNCTION update_stories_updated_at();

-- Update RLS policies for profiles
DROP POLICY IF EXISTS "Verified profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Verified profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (verified = true OR id = auth.uid() OR get_current_user_role() IN ('admin', 'chief_author'));

-- Create function to promote user to news anchor
CREATE OR REPLACE FUNCTION promote_to_news_anchor(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles 
    SET role = 'news_anchor', verified = true
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
END;
$$;

-- Create function to promote user to chief author
CREATE OR REPLACE FUNCTION promote_to_chief_author(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles 
    SET role = 'chief_author', verified = true
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
END;
$$;