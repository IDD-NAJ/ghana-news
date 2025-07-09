import React from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { HeroSlider } from '../components/HeroSlider';
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
        {/* Hero Slider */}
        <HeroSlider />

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
          

        </div>
      </main>

      <Footer />
      
      {/* Popup Advertisement */}
      <AdPopup currentPage="/" delay={3000} />
    </div>
  );
};

export default Index;