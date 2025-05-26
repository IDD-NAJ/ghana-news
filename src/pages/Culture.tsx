
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Culture = () => {
  const cultureNews = [
    {
      id: "7",
      title: "Traditional Chiefs Meet to Discuss Land Management",
      excerpt: "Traditional authorities from across Ghana convene to address modern challenges in land administration while preserving cultural heritage and customary practices.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Cultural Affairs",
      timeAgo: "7 hours ago",
      category: "Culture"
    },
    {
      id: "23",
      title: "Adae Festival Draws Thousands to Kumasi",
      excerpt: "The Ashanti region celebrates the traditional Adae festival with colorful ceremonies, attracting visitors from across the country and beyond.",
      image: "photo-1578662996442-48f60103fc96",
      author: "Cultural Heritage Reporter",
      timeAgo: "10 hours ago",
      category: "Culture"
    },
    {
      id: "24",
      title: "National Theatre Hosts Contemporary Dance Festival",
      excerpt: "Ghana's leading cultural venue showcases modern interpretations of traditional dances, blending heritage with contemporary artistic expression.",
      image: "photo-1508700115892-45ecd05ae2ad",
      author: "Arts & Culture Writer",
      timeAgo: "14 hours ago",
      category: "Culture"
    },
    {
      id: "25",
      title: "UNESCO Recognizes New Ghanaian Cultural Site",
      excerpt: "Another Ghanaian cultural landmark receives international recognition for its historical significance and preservation efforts.",
      image: "photo-1597149756107-b72500640a47",
      author: "Heritage Correspondent",
      timeAgo: "1 day ago",
      category: "Culture"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="animate-fade-in-up">
              <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-red pl-4">
                Culture & Heritage
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Explore Ghana's rich cultural heritage, traditional festivals, and contemporary arts scene.
              </p>
            </section>

            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cultureNews.map((news, index) => (
                  <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard {...news} />
                  </div>
                ))}
              </div>
            </section>

            <div className="text-center pt-8">
              <button className="bg-ghana-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Load More Culture Stories
              </button>
            </div>
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

export default Culture;
