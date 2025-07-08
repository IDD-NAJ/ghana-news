-- Enable RLS on articles table if not already enabled
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow chief authors and admins to create articles
CREATE POLICY "Chief authors and admins can create articles" 
ON public.articles 
FOR INSERT 
WITH CHECK (
    user_has_role('admin') OR user_has_role('chief_author')
);

-- Allow chief authors and admins to view all articles
CREATE POLICY "Chief authors and admins can view all articles" 
ON public.articles 
FOR SELECT 
USING (
    user_has_role('admin') OR user_has_role('chief_author')
);

-- Allow chief authors and admins to update articles
CREATE POLICY "Chief authors and admins can update articles" 
ON public.articles 
FOR UPDATE 
USING (
    user_has_role('admin') OR user_has_role('chief_author')
);

-- Allow chief authors and admins to delete articles
CREATE POLICY "Chief authors and admins can delete articles" 
ON public.articles 
FOR DELETE 
USING (
    user_has_role('admin') OR user_has_role('chief_author')
);

-- Allow public to view published articles
CREATE POLICY "Public can view published articles" 
ON public.articles 
FOR SELECT 
USING (published = true AND publication_date <= now());