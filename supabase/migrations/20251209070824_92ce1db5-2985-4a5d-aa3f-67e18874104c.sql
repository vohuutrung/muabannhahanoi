-- Drop the current SELECT policy that exposes user_id
DROP POLICY IF EXISTS "Users can view all properties but only see own user_id" ON public.properties;

-- Create a policy where only owners can SELECT from the base table
-- Public users should use properties_public view instead
CREATE POLICY "Only owners can read from base table"
ON public.properties
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow anon to read from the view (which excludes user_id)
-- The view already has GRANT SELECT for anon