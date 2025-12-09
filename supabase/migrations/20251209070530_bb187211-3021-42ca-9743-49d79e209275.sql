-- Drop the old view
DROP VIEW IF EXISTS public.properties_public;

-- Recreate view with SECURITY INVOKER (default, but explicit)
CREATE VIEW public.properties_public 
WITH (security_invoker = true)
AS
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