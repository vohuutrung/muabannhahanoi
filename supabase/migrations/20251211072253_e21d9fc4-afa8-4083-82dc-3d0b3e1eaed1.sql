-- Create a public view for posts that excludes user_id
CREATE VIEW public.posts_public AS
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