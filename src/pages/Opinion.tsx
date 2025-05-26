
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Opinion = () => {
  const opinionPieces = [
    {
      title: "The Future of Ghana's Democracy: Lessons from Recent Elections",
      excerpt: "A comprehensive analysis of Ghana's democratic journey, examining the challenges and opportunities that lie ahead for strengthening democratic institutions.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Dr. Kwame Nkrumah Jr.",
      timeAgo: "2 hours ago",
      category: "Opinion"
    },
    {
      title: "Economic Recovery: Why Youth Employment Should Be Priority",
      excerpt: "Ghana's economic future depends on creating meaningful opportunities for young people. Here's how policy makers can address the youth unemployment crisis.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Prof. Ama Aidoo",
      timeAgo: "4 hours ago",
      category: "Opinion"
    },
    {
      title: "Climate Change and Agriculture: Ghana's Path Forward",
      excerpt: "As climate change threatens traditional farming, Ghana must embrace innovative agricultural practices to ensure food security and economic stability.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Environmental Analyst",
      timeAgo: "6 hours ago",
      category: "Opinion"
    },
    {
      title: "Digital Education: Bridging Ghana's Technology Gap",
      excerpt: "The pandemic highlighted digital inequalities in education. Ghana needs strategic investment in technology infrastructure to prepare students for the future.",
      image: "photo-1518770660439-4636190af475",
      author: "Education Expert",
      timeAgo: "8 hours ago",
      category: "Opinion"
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
                Opinion
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opinionPieces.map((news, index) => (
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

export default Opinion;
