-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  link_text TEXT DEFAULT 'Learn More',
  ad_type TEXT NOT NULL CHECK (ad_type IN ('banner', 'sidebar', 'inline', 'popup', 'sponsored')),
  placement_position TEXT, -- 'top', 'bottom', 'left', 'right', 'middle' etc.
  target_pages TEXT[] DEFAULT '{}', -- Array of page paths where ad should show
  target_categories TEXT[] DEFAULT '{}', -- Array of categories where ad should show
  priority INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  budget_spent DECIMAL(10,2) DEFAULT 0,
  max_budget DECIMAL(10,2),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad interactions table for tracking
CREATE TABLE public.ad_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES public.advertisements(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'click')),
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for advertisements
CREATE POLICY "Anyone can view active advertisements"
ON public.advertisements
FOR SELECT
USING (
  active = true 
  AND (start_date IS NULL OR start_date <= now())
  AND (end_date IS NULL OR end_date >= now())
);

CREATE POLICY "Admins can manage all advertisements"
ON public.advertisements
FOR ALL
USING (user_has_role('admin'))
WITH CHECK (user_has_role('admin'));

-- Create policies for ad interactions
CREATE POLICY "Anyone can track ad interactions"
ON public.ad_interactions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all ad interactions"
ON public.ad_interactions
FOR SELECT
USING (user_has_role('admin'));

-- Create indexes for better performance
CREATE INDEX idx_advertisements_active ON public.advertisements(active);
CREATE INDEX idx_advertisements_type ON public.advertisements(ad_type);
CREATE INDEX idx_advertisements_dates ON public.advertisements(start_date, end_date);
CREATE INDEX idx_ad_interactions_ad_id ON public.ad_interactions(ad_id);
CREATE INDEX idx_ad_interactions_type ON public.ad_interactions(interaction_type);

-- Create trigger for updating updated_at
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();