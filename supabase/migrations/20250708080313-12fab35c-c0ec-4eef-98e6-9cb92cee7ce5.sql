-- Drop existing policy and recreate with proper permissions
DROP POLICY IF EXISTS "Allow public advertising inquiry submissions" ON public.advertising_inquiries;

-- Create a comprehensive policy that allows anyone to insert
CREATE POLICY "Anyone can submit advertising inquiries" 
ON public.advertising_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Also ensure we have a SELECT policy for the return data
CREATE POLICY IF NOT EXISTS "Anyone can read their own inquiry" 
ON public.advertising_inquiries 
FOR SELECT 
USING (true);