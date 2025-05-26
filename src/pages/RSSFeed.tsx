
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Rss, Smartphone, Globe, Settings } from 'lucide-react';

const RSSFeed = () => {
  const feedCategories = [
    { name: "All News", url: "https://233blognews.com/feeds/all", description: "Complete news feed from all categories" },
    { name: "Politics", url: "https://233blognews.com/feeds/politics", description: "Political news and government updates" },
    { name: "Sports", url: "https://233blognews.com/feeds/sports", description: "Sports news and match updates" },
    { name: "Business", url: "https://233blognews.com/feeds/business", description: "Business and economic news" },
    { name: "Technology", url: "https://233blognews.com/feeds/technology", description: "Tech news and digital innovation" },
    { name: "Entertainment", url: "https://233blognews.com/feeds/entertainment", description: "Entertainment and celebrity news" },
    { name: "Lifestyle", url: "https://233blognews.com/feeds/lifestyle", description: "Lifestyle and cultural content" },
    { name: "Opinion", url: "https://233blognews.com/feeds/opinion", description: "Opinion pieces and editorial content" }
  ];

  const rssReaders = [
    { name: "Feedly", description: "Popular web-based RSS reader with mobile apps", url: "https://feedly.com" },
    { name: "Inoreader", description: "Feature-rich RSS reader with advanced filtering", url: "https://inoreader.com" },
    { name: "NewsBlur", description: "Social RSS reader with training features", url: "https://newsblur.com" },
    { name: "The Old Reader", description: "Simple, clean RSS reader inspired by Google Reader", url: "https://theoldreader.com" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('RSS feed URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 border-l-4 border-slate-600 pl-4">
            RSS Feeds
          </h1>
          
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="flex items-start space-x-6">
              <Rss className="w-16 h-16 text-slate-600 flex-shrink-0 mt-2" />
              <div>
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">Stay Updated with RSS</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  RSS (Really Simple Syndication) feeds allow you to stay updated with the latest news from 
                  +233BLOG-NEWS without visiting our website. Subscribe to our feeds using your favorite RSS 
                  reader and never miss important news from Ghana.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our RSS feeds are updated in real-time, ensuring you get the latest news as soon as it's published. 
                  Choose from our general feed or category-specific feeds based on your interests.
                </p>
              </div>
            </div>
          </div>

          {/* Available Feeds */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Available RSS Feeds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedCategories.map((feed, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-700">{feed.name}</h3>
                    <Rss className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-gray-600 mb-4">{feed.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 font-mono break-all">{feed.url}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(feed.url)}
                    className="w-full bg-slate-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors duration-200"
                  >
                    Copy Feed URL
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* How to Use RSS */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              How to Use RSS Feeds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Settings className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Choose an RSS Reader</h3>
                <p className="text-gray-600">
                  Select an RSS reader application or service that works on your preferred devices and platforms.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Add Our Feed URL</h3>
                <p className="text-gray-600">
                  Copy the RSS feed URL from above and add it to your RSS reader by pasting the URL.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Smartphone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Stay Updated</h3>
                <p className="text-gray-600">
                  Your RSS reader will automatically fetch new articles and notify you when fresh content is available.
                </p>
              </div>
            </div>
          </section>

          {/* Recommended RSS Readers */}
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
              Recommended RSS Readers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rssReaders.map((reader, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <h3 className="text-xl font-semibold text-slate-700 mb-3">{reader.name}</h3>
                  <p className="text-gray-600 mb-4">{reader.description}</p>
                  <a
                    href={reader.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-slate-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors duration-200"
                  >
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <div className="bg-slate-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Benefits of Using RSS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">No need to remember to check our website manually</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Get updates from multiple news sources in one place</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">No email clutter or spam</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Faster loading and data-efficient</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Read articles offline with many RSS readers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Privacy-friendly way to follow news</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RSSFeed;
