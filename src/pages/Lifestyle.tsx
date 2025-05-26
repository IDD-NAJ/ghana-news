
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Lifestyle = () => {
  const lifestyleNews = [
    {
      title: "Traditional Ghanaian Cuisine Gains International Recognition",
      excerpt: "Local chefs are bringing authentic Ghanaian flavors to world-class restaurants, showcasing the rich culinary heritage of West Africa.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Food & Culture Writer",
      timeAgo: "1 hour ago",
      category: "Lifestyle"
    },
    {
      title: "Wellness Tourism: Ghana's Hidden Gem Destinations",
      excerpt: "Discover serene locations across Ghana perfect for wellness retreats, eco-tourism, and spiritual rejuvenation away from city life.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Travel Correspondent",
      timeAgo: "3 hours ago",
      category: "Lifestyle"
    },
    {
      title: "Fashion Forward: Young Ghanaian Designers Make Their Mark",
      excerpt: "Emerging fashion talents are blending traditional African aesthetics with contemporary design, creating unique styles that appeal globally.",
      image: "photo-1526374965328-7f61d4dc18c5",
      author: "Fashion Editor",
      timeAgo: "5 hours ago",
      category: "Lifestyle"
    },
    {
      title: "Home Decor Trends: Bringing African Heritage Indoors",
      excerpt: "Interior design experts share tips on incorporating traditional Ghanaian art and craftsmanship into modern home decoration.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Design Specialist",
      timeAgo: "7 hours ago",
      category: "Lifestyle"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-gold pl-4">
                Lifestyle
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lifestyleNews.map((news, index) => (
                  <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard {...news} />
                  </div>
                ))}
              </div>
            </section>
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

export default Lifestyle;
