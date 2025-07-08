-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.publish_approved_story();

-- Function to publish approved stories as articles
CREATE OR REPLACE FUNCTION public.publish_approved_story()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Create article from the approved story
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
      NEW.author_id,
      NEW.title,
      NEW.content,
      NEW.excerpt,
      NEW.category,
      NEW.image_url,
      COALESCE(NEW.slug, lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'))),
      true, -- Published immediately
      false, -- Not featured by default
      now(), -- Publish immediately
      now(),
      now()
    );
    
    -- Update story status to 'published'
    NEW.status = 'published';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_publish_approved_story ON public.stories;

-- Create trigger to automatically publish approved stories
CREATE TRIGGER trigger_publish_approved_story
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION public.publish_approved_story();