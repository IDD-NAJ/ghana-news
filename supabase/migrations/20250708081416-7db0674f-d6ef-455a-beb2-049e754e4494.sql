-- Add new columns first (without changing role column yet)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS expertise_areas TEXT[];

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

-- Create a helper function to check user roles (works with text for now)
CREATE OR REPLACE FUNCTION public.user_has_role(check_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = check_role
  );
$$;

-- RLS policies for stories
CREATE POLICY "News anchors can view their own stories" 
ON public.stories 
FOR SELECT 
USING (author_id = auth.uid() OR user_has_role('admin') OR user_has_role('chief_author'));

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
    (author_id = auth.uid() AND status = 'pending')
    OR user_has_role('admin') 
    OR user_has_role('chief_author')
);

CREATE POLICY "Admins and chief authors can manage all stories" 
ON public.stories 
FOR ALL 
USING (user_has_role('admin') OR user_has_role('chief_author'));

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

-- Create functions to promote users
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