-- Add RSS feed URLs to existing news sources for testing
UPDATE news_sources 
SET rss_feed_url = CASE 
  WHEN name = 'BBC' THEN 'https://feeds.bbci.co.uk/news/rss.xml'
  WHEN name = 'WION News' THEN 'https://www.wionews.com/rss'
  ELSE rss_feed_url
END
WHERE name IN ('BBC', 'WION News');

-- Insert a reliable test news source with RSS feed
INSERT INTO news_sources (name, url, rss_feed_url, active) 
VALUES ('Reuters World News', 'https://www.reuters.com', 'https://www.reutersagency.com/feed/?best-regions=world&post_type=best', true)
ON CONFLICT (name) DO UPDATE SET 
  rss_feed_url = EXCLUDED.rss_feed_url,
  active = EXCLUDED.active;