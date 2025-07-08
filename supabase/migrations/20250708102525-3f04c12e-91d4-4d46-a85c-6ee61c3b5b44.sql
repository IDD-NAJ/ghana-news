-- Drop the old valid_role constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS valid_role;

-- Add the updated constraint with all valid roles
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_role 
CHECK (role IN ('customer', 'news_anchor', 'chief_author', 'admin'));

-- Also remove the duplicate constraint we added earlier if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;