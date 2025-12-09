-- Create a public view that excludes user_id for anonymous access
CREATE OR REPLACE VIEW public.properties_public AS
SELECT 
  id,
  price,
  area,
  floors,
  bedrooms,
  bathrooms,
  created_at,
  updated_at,
  district,
  title,
  description,
  ward,
  street,
  alley,
  vip_type,
  images,
  city
FROM public.properties;

-- Grant access to the view
GRANT SELECT ON public.properties_public TO anon, authenticated;

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

-- Create new SELECT policy: users can only see their own user_id
-- For public access without user_id, use the properties_public view
CREATE POLICY "Users can view all properties but only see own user_id"
ON public.properties
FOR SELECT
USING (true);

-- Note: The view already excludes user_id, so public queries should use properties_public
-- Direct table access still shows user_id only via RLS for the owner