
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';
import { useArticleImages } from '../hooks/useArticleImages';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  slug: string;
  created_at: string;
  updated_at: string;
  publication_date: string;
  author_id: string;
}

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { images: articleImages, loading: imagesLoading } = useArticleImages(article?.id);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      console.log('Fetching article with ID:', articleId);
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .eq('published', true)
        .lte('publication_date', new Date().toISOString()) // Only show if publication date has passed
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        console.log('Current time:', new Date().toISOString());
        setError('Article not found or not yet published');
        return;
      }

      console.log('Fetched article:', data);
      console.log('Article publication date:', data.publication_date);
      console.log('Current time:', new Date().toISOString());
      setArticle(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg mb-2">Loading article...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-2">Article Not Found</div>
            <div className="text-sm text-gray-600 mb-4">
              {error || 'The requested article could not be found or is not yet published.'}
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-ghana-red text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-ghana-red transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to News</span>
            </button>

            {/* Article Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative">
                {/* Featured Image */}
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-ghana-red text-white px-3 py-1 text-sm font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">News Desk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                      3 min read
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span className="text-gray-600 text-sm">Share:</span>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                  {article.excerpt && (
                    <p className="text-xl text-gray-700 mb-6 font-medium">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="whitespace-pre-line">
                    {article.content}
                  </div>
                </div>

                {/* Article Images */}
                {articleImages.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articleImages.map((image, index) => (
                        <div key={image.id} className="space-y-2">
                          <img
                            src={image.image_url}
                            alt={image.caption || `Article image ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          {image.caption && (
                            <p className="text-sm text-gray-600 italic">{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Published on {formatDate(article.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </article>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Story;
