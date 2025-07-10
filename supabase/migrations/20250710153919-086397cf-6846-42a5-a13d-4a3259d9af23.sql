-- Update MyJoyOnline and GhanaWeb - these sites typically don't have RSS feeds
-- so we'll leave rss_feed_url as NULL and let the workflow handle web scraping

-- Add some other Ghanaian news sources that do have RSS feeds
INSERT INTO news_sources (name, url, rss_feed_url, active) 
VALUES 
  ('Graphic Online', 'https://www.graphic.com.gh', 'https://www.graphic.com.gh/rss/news.xml', true),
  ('Citinews', 'https://citinewsroom.com', 'https://citinewsroom.com/feed/', true),
  ('GhanaFeed', 'https://www.ghanafeed.com', 'https://www.ghanafeed.com/feed/', true)
ON CONFLICT DO NOTHING;