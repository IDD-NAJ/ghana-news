-- Add RSS feed URLs to existing news sources for testing
UPDATE news_sources 
SET rss_feed_url = 'https://feeds.bbci.co.uk/news/rss.xml'
WHERE name = 'BBC' AND rss_feed_url IS NULL;

UPDATE news_sources 
SET rss_feed_url = 'https://www.wionews.com/rss'
WHERE name = 'WION News' AND rss_feed_url IS NULL;

-- Insert a reliable test news source with RSS feed
INSERT INTO news_sources (name, url, rss_feed_url, active) 
VALUES ('Reuters World News', 'https://www.reuters.com', 'https://www.reutersagency.com/feed/?best-regions=world&post_type=best', true);