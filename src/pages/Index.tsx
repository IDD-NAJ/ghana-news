import React from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { usePagination } from '../hooks/usePagination';
import { useArticles, useFeaturedArticle } from '../hooks/useArticles';
import { AdBanner } from '../components/AdBanner';
import { AdInline } from '../components/AdInline';
import { AdPopup } from '../components/AdPopup';

const Index = () => {
  const { featuredArticle, loading: featuredLoading } = useFeaturedArticle();
  const { articles: mainNews, loading: articlesLoading } = useArticles();
  
  const { currentItems, hasMore, loadMore } = usePagination({
    items: mainNews,
    itemsPerPage: 4
  });

  const isLoading = featuredLoading || articlesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen font-inter">
        <Banner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center elegant-card rounded-lg p-8 glow-effect">
            <div className="text-lg mb-2 text-shadow">Loading articles...</div>
            <div className="animate-pulse w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter relative">
      <Banner />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=1080&fit=crop')`
            }}
          />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-shadow animate-fade-in-up">
                Stay Informed with <span className="text-primary-foreground">+233Blog-news</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Your trusted source for breaking news, in-depth analysis, and stories that matter in Ghana and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <button className="elegant-card px-8 py-3 rounded-lg font-semibold hover:glow-effect transition-all duration-300 text-foreground hover:scale-105">
                  Explore Latest News
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-foreground transition-all duration-300">
                  Subscribe Newsletter
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Top Banner Ad */}
          <AdBanner placement="top" currentPage="/" />
          
          {/* Breaking News Ticker */}
          <section className="mb-8">
            <div className="elegant-card rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-4 animate-pulse">
                  BREAKING
                </span>
                <div className="flex-1 overflow-hidden">
                  <div className="animate-marquee whitespace-nowrap text-foreground font-medium">
                    Latest updates from around the globe • Political developments • Economic indicators • Sports highlights • Technology breakthroughs
                  </div>
                </div>
              </div>
            </div>
          </section>
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured News */}
              {featuredArticle && (
                <section className="animate-fade-in-up">
                  <h2 className="text-2xl font-playfair font-bold text-foreground mb-6 border-l-4 border-primary pl-4 text-shadow">
                    Featured Story
                  </h2>
                  <div className="elegant-card rounded-xl p-6 glow-effect">
                    <NewsCard
                      article={featuredArticle}
                      isLarge={true}
                    />
                  </div>
                </section>
              )}

              {/* Inline Advertisement */}
              <AdInline currentPage="/" />

              {/* Latest News Grid */}
              <section>
                <h2 className="text-2xl font-playfair font-bold text-foreground mb-6 border-l-4 border-primary pl-4 text-shadow">
                  Latest News
                </h2>
                {currentItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentItems.map((news, index) => (
                      <div key={news.id} className="animate-fade-in-up elegant-card rounded-xl p-6 hover:glow-effect transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NewsCard
                          article={news}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 elegant-card rounded-lg">
                    <p className="text-muted-foreground">No articles available at the moment.</p>
                  </div>
                )}
              </section>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-8">
                  <button 
                    onClick={loadMore}
                    className="elegant-card px-8 py-3 rounded-lg font-semibold hover:glow-effect transition-all duration-300 transform hover:-translate-y-1 text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    Load More Stories
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 elegant-card rounded-xl p-6 glow-effect">
                <Sidebar />
              </div>
            </div>
          </div>
          

          {/* Newsletter Section */}
          <section className="my-16">
            <div 
              className="relative rounded-2xl overflow-hidden p-12 text-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop')`
              }}
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4 text-shadow">
                Never Miss a Story
              </h2>
              <p className="text-lg text-white mb-8 max-w-2xl mx-auto text-shadow">
                Subscribe to our newsletter and get the latest news delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 elegant-card"
                />
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:glow-effect transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      
      {/* Popup Advertisement */}
      <AdPopup currentPage="/" delay={3000} />
    </div>
  );
};

export default Index;