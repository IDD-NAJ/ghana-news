
-- Add missing RLS policies for admins to manage articles
CREATE POLICY "Admins can insert articles" 
  ON public.articles 
  FOR INSERT 
  WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update articles" 
  ON public.articles 
  FOR UPDATE 
  USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete articles" 
  ON public.articles 
  FOR DELETE 
  USING (public.get_current_user_role() = 'admin');
