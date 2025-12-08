-- Create properties table for storing property listings
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  area NUMERIC NOT NULL,
  floors INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  city TEXT DEFAULT 'Hà Nội',
  district TEXT NOT NULL,
  ward TEXT,
  street TEXT,
  alley TEXT,
  vip_type TEXT CHECK (vip_type IN ('none', 'KIMCUONG', 'VANG', 'BAC')),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view properties)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create policy for insert (for now, anyone can insert - you may want to restrict this later to authenticated users)
CREATE POLICY "Anyone can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (true);

-- Create policy for update (for now, anyone can update - you may want to restrict this later)
CREATE POLICY "Anyone can update properties" 
ON public.properties 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Create storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Anyone can update property images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can delete property images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images');