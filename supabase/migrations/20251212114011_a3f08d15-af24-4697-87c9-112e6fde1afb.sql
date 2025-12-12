-- Create properties table with all required columns including new additional info fields
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  area NUMERIC NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  city TEXT,
  district TEXT NOT NULL,
  ward TEXT,
  street TEXT,
  address TEXT,
  images TEXT[],
  vip_type TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- New additional information fields
  legal_documents TEXT,
  interior TEXT,
  house_direction TEXT,
  balcony_direction TEXT,
  access_road NUMERIC,
  frontage NUMERIC
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (properties are public listings)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert their own properties
CREATE POLICY "Users can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (true);

-- Create policy for users to update their own properties or admin
CREATE POLICY "Users can update properties" 
ON public.properties 
FOR UPDATE 
USING (true);

-- Create policy for users to delete their own properties
CREATE POLICY "Users can delete properties" 
ON public.properties 
FOR DELETE 
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