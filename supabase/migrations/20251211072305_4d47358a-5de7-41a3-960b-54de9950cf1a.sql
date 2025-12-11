-- Fix the security definer issue by explicitly setting security_invoker
DROP VIEW IF EXISTS public.posts_public;

CREATE VIEW public.posts_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  price,
  area,
  bedrooms,
  bathrooms,
  floors,
  city,
  district,
  ward,
  street,
  alley,
  listing_type,
  images,
  created_at,
  updated_at
FROM public.posts;

-- Grant SELECT access to authenticated and anonymous users
GRANT SELECT ON public.posts_public TO anon, authenticated;