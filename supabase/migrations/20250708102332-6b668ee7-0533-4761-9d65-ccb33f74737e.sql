-- Add RLS policy to allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Also ensure admins can manage user verification status
CREATE POLICY "Admins can update verification status"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  get_current_user_role() = 'admin' OR
  (id = auth.uid())  -- Users can still update their own profiles
)
WITH CHECK (
  get_current_user_role() = 'admin' OR
  (id = auth.uid())  -- Users can still update their own profiles
);