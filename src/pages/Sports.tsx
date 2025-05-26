
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Sports = () => {
  const sportsNews = [
    {
      title: "Black Stars Prepare for AFCON Qualifier Against Nigeria",
      excerpt: "Ghana's national football team intensifies training ahead of the crucial Africa Cup of Nations qualifier, with coach emphasizing tactical discipline and team unity.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Sports Editor",
      timeAgo: "30 minutes ago",
      category: "Sports"
    },
    {
      title: "Hearts of Oak Signs New Striker from Europe",
      excerpt: "Accra Hearts of Oak FC announces the signing of promising striker from European club, strengthening their squad for the upcoming Ghana Premier League season.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Football Reporter",
      timeAgo: "2 hours ago",
      category: "Sports"
    },
    {
      title: "Ghana Boxing Federation Launches Youth Development Program",
      excerpt: "New initiative aims to identify and nurture young boxing talents across the country, with plans to establish training centers in all regions.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Boxing Correspondent",
      timeAgo: "4 hours ago",
      category: "Sports"
    },
    {
      title: "Olympic Preparation: Athletes Begin Training Camp",
      excerpt: "Ghana's Olympic-bound athletes commence intensive training program at the national sports complex, focusing on fitness and technique refinement.",
      image: "photo-1531297484001-80022131f5a1",
      author: "Olympics Desk",
      timeAgo: "6 hours ago",
      category: "Sports"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-green pl-4">
                Sports
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sportsNews.map((news, index) => (
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

export default Sports;
