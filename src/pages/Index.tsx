
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { usePagination } from '../hooks/usePagination';
import { getFeaturedNews, getMainNews } from '../data/newsData';

const Index = () => {
  const featuredNews = getFeaturedNews();
  const mainNews = getMainNews();
  
  const { currentItems, hasMore, loadMore } = usePagination({
    items: mainNews,
    itemsPerPage: 4
  });

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            <section className="animate-fade-in-up">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-red pl-4">
                Featured Story
              </h2>
              <NewsCard
                {...featuredNews}
                isLarge={true}
              />
            </section>

            {/* Latest News Grid */}
            <section>
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-green pl-4">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.map((news, index) => (
                  <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard {...news} />
                  </div>
                ))}
              </div>
            </section>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-8">
                <button 
                  onClick={loadMore}
                  className="bg-ghana-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Load More Stories
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
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

export default Index;
