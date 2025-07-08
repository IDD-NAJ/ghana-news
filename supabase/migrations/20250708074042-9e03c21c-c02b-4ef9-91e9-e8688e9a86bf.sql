-- Create banner_items table for admin-managed banner content
CREATE TABLE public.banner_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('breaking', 'announcement', 'alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  link_text TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.banner_items ENABLE ROW LEVEL SECURITY;

-- Create policies for banner_items
CREATE POLICY "Anyone can view active banner items" 
ON public.banner_items 
FOR SELECT 
USING (active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage banner items" 
ON public.banner_items 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_banner_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banner_items_updated_at
BEFORE UPDATE ON public.banner_items
FOR EACH ROW
EXECUTE FUNCTION public.update_banner_items_updated_at();

-- Insert default banner items
INSERT INTO public.banner_items (type, title, message, link, link_text, priority) VALUES
('breaking', 'BREAKING', 'Parliament approves 2024 budget with significant infrastructure investments', '/politics', 'Read More', 'high'),
('announcement', 'NEW', 'Subscribe to our newsletter for daily news updates and exclusive content', '#newsletter', 'Subscribe', 'medium');