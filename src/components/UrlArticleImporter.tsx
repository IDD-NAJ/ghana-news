
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Link, Loader2 } from 'lucide-react';

interface UrlArticleImporterProps {
  onArticleImported: (articleData: {
    title: string;
    content: string;
    excerpt: string;
    image_url?: string;
  }) => void;
}

const UrlArticleImporter: React.FC<UrlArticleImporterProps> = ({ onArticleImported }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractArticleData = async (url: string) => {
    try {
      setIsLoading(true);
      setError('');

      // Use a simple fetch to get the HTML content
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch the webpage');
      }

      const data = await response.json();
      const html = data.contents;

      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract title
      let title = '';
      const titleElement = doc.querySelector('title') || 
                          doc.querySelector('h1') || 
                          doc.querySelector('[property="og:title"]') || 
                          doc.querySelector('[name="title"]');
      
      if (titleElement) {
        title = titleElement.getAttribute('content') || titleElement.textContent || '';
      }

      // Extract main content
      let content = '';
      const contentSelectors = [
        'article',
        '[role="main"]',
        '.content',
        '.article-content',
        '.post-content',
        'main',
        '.entry-content'
      ];

      for (const selector of contentSelectors) {
        const contentElement = doc.querySelector(selector);
        if (contentElement) {
          // Remove script and style elements
          const scripts = contentElement.querySelectorAll('script, style');
          scripts.forEach(el => el.remove());
          
          content = contentElement.textContent || '';
          break;
        }
      }

      // If no main content found, try to get text from paragraphs
      if (!content) {
        const paragraphs = doc.querySelectorAll('p');
        content = Array.from(paragraphs)
          .map(p => p.textContent || '')
          .filter(text => text.length > 50)
          .join('\n\n');
      }

      // Extract excerpt (first 200 characters of content)
      const excerpt = content.substring(0, 200).trim() + '...';

      // Extract image
      let image_url = '';
      const imgSelectors = [
        '[property="og:image"]',
        '[name="twitter:image"]',
        'article img',
        '.featured-image img',
        'main img'
      ];

      for (const selector of imgSelectors) {
        const imgElement = doc.querySelector(selector);
        if (imgElement) {
          image_url = imgElement.getAttribute('content') || imgElement.getAttribute('src') || '';
          if (image_url && !image_url.startsWith('http')) {
            // Convert relative URL to absolute
            const baseUrl = new URL(url).origin;
            image_url = new URL(image_url, baseUrl).href;
          }
          break;
        }
      }

      if (!title && !content) {
        throw new Error('Could not extract article content from the provided URL');
      }

      const articleData = {
        title: title.trim() || 'Imported Article',
        content: content.trim(),
        excerpt: excerpt,
        image_url: image_url || undefined
      };

      onArticleImported(articleData);
      setUrl('');
      
    } catch (err) {
      console.error('Error extracting article:', err);
      setError(err instanceof Error ? err.message : 'Failed to import article from URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(url); // Validate URL format
      extractArticleData(url);
    } catch {
      setError('Please enter a valid URL');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="w-5 h-5" />
          <span>Import Article from URL</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article URL
            </label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading || !url.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing Article...
              </>
            ) : (
              'Import Article'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlArticleImporter;
