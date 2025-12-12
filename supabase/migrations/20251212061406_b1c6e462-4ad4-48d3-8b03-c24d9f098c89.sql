-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Allow anyone to view property images
CREATE POLICY "Public Access to property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to upload property images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Allow users to update their own property images
CREATE POLICY "Users can update their property images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own property images
CREATE POLICY "Users can delete their property images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);