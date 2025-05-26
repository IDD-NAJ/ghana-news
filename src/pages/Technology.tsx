
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { usePagination } from '../hooks/usePagination';
import { getNewsByCategory } from '../data/newsData';

const Technology = () => {
  const technologyNews = getNewsByCategory('Technology');
  
  const { currentItems, hasMore, loadMore } = usePagination({
    items: technologyNews,
    itemsPerPage: 2
  });

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="animate-fade-in-up">
              <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-slate-600 pl-4">
                Technology News
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Stay updated with the latest technological innovations and digital developments in Ghana.
              </p>
            </section>

            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.map((news, index) => (
                  <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard {...news} />
                  </div>
                ))}
              </div>
            </section>

            {hasMore && (
              <div className="text-center pt-8">
                <button 
                  onClick={loadMore}
                  className="bg-ghana-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Load More Technology Stories
                </button>
              </div>
            )}
          </div>
          
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

export default Technology;
