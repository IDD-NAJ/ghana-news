-- Drop the existing restrictive policy and create a proper one for advertising inquiries
DROP POLICY IF EXISTS "Anyone can submit advertising inquiries" ON public.advertising_inquiries;

-- Create a proper policy that allows anyone to insert advertising inquiries
CREATE POLICY "Allow public advertising inquiry submissions" 
ON public.advertising_inquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);