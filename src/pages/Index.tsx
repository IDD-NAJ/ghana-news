
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import { usePagination } from '../hooks/usePagination';
import { useArticles, useFeaturedArticle } from '../hooks/useArticles';

const Index = () => {
  const { featuredArticle, loading: featuredLoading } = useFeaturedArticle();
  const { articles: mainNews, loading: articlesLoading } = useArticles();
  
  const { currentItems, hasMore, loadMore } = usePagination({
    items: mainNews,
    itemsPerPage: 6
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoading = featuredLoading || articlesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg mb-2 text-white animate-pulse">Loading articles...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <HeroSection featuredArticle={featuredArticle} scrollY={scrollY} />
      
      {/* Stats Section */}
      <StatsSection />
      
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Latest News Grid */}
            <section>
              <div 
                className="text-center mb-12"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`,
                }}
              >
                <h2 className="text-4xl font-playfair font-bold text-white mb-4 relative">
                  <span className="bg-gradient-to-r from-ghana-gold via-white to-ghana-gold bg-clip-text text-transparent">
                    Latest Stories
                  </span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-ghana-red to-ghana-green rounded-full"></div>
                </h2>
                <p className="text-gray-300 text-lg">Stay informed with our latest breaking news</p>
              </div>
              
              {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentItems.map((news, index) => (
                    <div 
                      key={news.id} 
                      className="animate-fade-in-up transform hover:scale-105 transition-all duration-500 hover:rotate-1"
                      style={{ 
                        animationDelay: `${index * 0.2}s`,
                        transform: `translateY(${scrollY * 0.05}px)`,
                      }}
                    >
                      <div className="group perspective-1000">
                        <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-ghana-red/20 to-ghana-green/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-700 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-105"></div>
                          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden shadow-2xl">
                            <NewsCard article={news} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
                    <p className="text-gray-300 text-lg">No articles available at the moment.</p>
                  </div>
                </div>
              )}
            </section>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-12">
                <button 
                  onClick={loadMore}
                  className="group relative overflow-hidden bg-gradient-to-r from-ghana-red to-ghana-green text-white px-12 py-4 rounded-full font-semibold text-lg shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-ghana-red/50"
                >
                  <span className="relative z-10">Load More Stories</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-ghana-green to-ghana-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div 
              className="sticky top-24"
              style={{
                transform: `translateY(${scrollY * 0.02}px)`,
              }}
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 shadow-2xl">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 left-10 w-64 h-64 bg-ghana-red/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
          }}
        ></div>
        <div 
          className="absolute top-3/4 right-10 w-96 h-96 bg-ghana-green/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.03}px)`,
            animationDelay: '1s',
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-ghana-gold/5 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(-50%, -50%) translate(${scrollY * 0.02}px, ${scrollY * 0.08}px)`,
            animationDelay: '2s',
          }}
        ></div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
