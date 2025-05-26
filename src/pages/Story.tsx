
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { getNewsById } from '../data/newsData';

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get the actual news item by ID
  const newsItem = id ? getNewsById(id) : null;

  // Fallback content if news item not found
  const storyData = newsItem || {
    title: "Story Not Found",
    excerpt: "The requested story could not be found.",
    content: "<p>The requested story could not be found.</p>",
    image: "photo-1581091226825-a6a2a5aee158",
    author: "News Desk",
    timeAgo: "Unknown",
    category: "News"
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = storyData.title;
    
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
                <img
                  src={`https://images.unsplash.com/${storyData.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80`}
                  alt={storyData.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-ghana-red text-white px-3 py-1 text-sm font-semibold rounded-full">
                    {storyData.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
                  {storyData.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{storyData.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{storyData.timeAgo}</span>
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
                  <p className="text-xl text-gray-700 mb-6 font-medium">
                    {storyData.excerpt}
                  </p>
                  <div className="whitespace-pre-line">
                    {storyData.content}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Published on Friday, May 26, 2025
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
