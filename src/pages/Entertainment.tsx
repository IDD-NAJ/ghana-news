
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Entertainment = () => {
  const entertainmentNews = [
    {
      title: "Ghanaian Film Wins Award at Cannes Film Festival",
      excerpt: "Local filmmaker receives international recognition for groundbreaking drama that explores contemporary African storytelling and cultural heritage.",
      image: "photo-1526374965328-7f61d4dc18c5",
      author: "Entertainment Editor",
      timeAgo: "1 hour ago",
      category: "Entertainment"
    },
    {
      title: "Highlife Legend Announces Farewell Concert Series",
      excerpt: "Veteran musician plans nationwide tour to celebrate decades of contribution to Ghana's music industry and pass the torch to younger generation.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Music Correspondent",
      timeAgo: "3 hours ago",
      category: "Entertainment"
    },
    {
      title: "New TV Series Showcases Ghanaian Culture to Global Audience",
      excerpt: "Production company launches ambitious series highlighting Ghana's rich traditions, modern lifestyle, and diverse communities for international streaming platforms.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Media Reporter",
      timeAgo: "5 hours ago",
      category: "Entertainment"
    },
    {
      title: "Fashion Week Accra Announces Star-Studded Lineup",
      excerpt: "Annual fashion event promises spectacular showcase of African designers, with international models and celebrities expected to grace the runway.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Fashion Writer",
      timeAgo: "7 hours ago",
      category: "Entertainment"
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
                Entertainment
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entertainmentNews.map((news, index) => (
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

export default Entertainment;
