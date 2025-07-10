-- Create news sources table for managing outlets
CREATE TABLE public.news_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  rss_feed_url TEXT,
  api_endpoint TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draft articles table for n8n automation
CREATE TABLE public.draft_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES public.news_sources(id),
  original_url TEXT,
  original_title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  paraphrased_title TEXT NOT NULL,
  paraphrased_content TEXT NOT NULL,
  paraphrased_excerpt TEXT,
  suggested_category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_webhook_url TEXT,
  notification_recipients TEXT[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news_sources
CREATE POLICY "Admins can manage news sources"
ON public.news_sources
FOR ALL
USING (user_has_role('admin') OR user_has_role('chief_author'));

CREATE POLICY "Anyone can view active news sources"
ON public.news_sources
FOR SELECT
USING (active = true);

-- RLS Policies for draft_articles
CREATE POLICY "Admins and chief authors can manage draft articles"
ON public.draft_articles
FOR ALL
USING (user_has_role('admin') OR user_has_role('chief_author'));

-- RLS Policies for notification_settings
CREATE POLICY "Admins can manage notification settings"
ON public.notification_settings
FOR ALL
USING (user_has_role('admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_news_sources_updated_at
BEFORE UPDATE ON public.news_sources
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_draft_articles_updated_at
BEFORE UPDATE ON public.draft_articles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_notification_settings_updated_at
BEFORE UPDATE ON public.notification_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to auto-publish approved draft articles
CREATE OR REPLACE FUNCTION public.publish_approved_draft()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Create article from the approved draft
    INSERT INTO public.articles (
      author_id,
      title,
      content,
      excerpt,
      category,
      image_url,
      slug,
      published,
      featured,
      publication_date,
      created_at,
      updated_at
    ) VALUES (
      COALESCE(NEW.reviewed_by, (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)),
      NEW.paraphrased_title,
      NEW.paraphrased_content,
      NEW.paraphrased_excerpt,
      NEW.suggested_category,
      NEW.image_url,
      lower(regexp_replace(NEW.paraphrased_title, '[^a-zA-Z0-9]+', '-', 'g')),
      true, -- Published immediately
      false, -- Not featured by default
      now(), -- Publish immediately
      now(),
      now()
    );
    
    -- Update draft status to 'published'
    NEW.status = 'published';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-publishing
CREATE TRIGGER publish_approved_draft_trigger
BEFORE UPDATE ON public.draft_articles
FOR EACH ROW
EXECUTE FUNCTION public.publish_approved_draft();