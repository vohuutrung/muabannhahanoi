-- Add user_id column to properties table
ALTER TABLE public.properties ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop existing permissive RLS policies
DROP POLICY IF EXISTS "Anyone can create properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can update properties" ON public.properties;
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

-- Create new secure RLS policies
-- Anyone can view properties (public read)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Only authenticated users can create properties (and must set their user_id)
CREATE POLICY "Authenticated users can create properties" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only property owners can update their properties
CREATE POLICY "Users can update own properties" 
ON public.properties 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only property owners can delete their properties
CREATE POLICY "Users can delete own properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update property images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete property images" ON storage.objects;

-- Create secure storage policies
-- Anyone can view images (public read)
CREATE POLICY "Anyone can view property images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

-- Only authenticated users can upload images
CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Only authenticated users can update images  
CREATE POLICY "Authenticated users can update property images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'property-images');

-- Only authenticated users can delete images
CREATE POLICY "Authenticated users can delete property images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'property-images');