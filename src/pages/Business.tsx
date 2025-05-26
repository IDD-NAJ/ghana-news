
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Business = () => {
  const businessNews = [
    {
      title: "Ghana Stock Exchange Records Significant Growth",
      excerpt: "Local bourse shows remarkable performance with increased trading volumes and new listings, reflecting growing investor confidence in Ghana's economy.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Business Editor",
      timeAgo: "45 minutes ago",
      category: "Business"
    },
    {
      title: "Tech Startup Raises $5M in Series A Funding",
      excerpt: "Ghanaian fintech company secures major investment round to expand digital payment solutions across West Africa, creating hundreds of new jobs.",
      image: "photo-1518770660439-4636190af475",
      author: "Startup Reporter",
      timeAgo: "2 hours ago",
      category: "Business"
    },
    {
      title: "Mining Sector Implements New Environmental Standards",
      excerpt: "Industry leaders announce comprehensive sustainability measures to balance economic growth with environmental protection and community welfare.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Mining Correspondent",
      timeAgo: "4 hours ago",
      category: "Business"
    },
    {
      title: "Banking Sector Launches Digital Transformation Initiative",
      excerpt: "Major banks collaborate on modernization project to enhance customer experience and compete with emerging fintech solutions.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Banking Reporter",
      timeAgo: "6 hours ago",
      category: "Business"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-slate-600 pl-4">
                Business
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessNews.map((news, index) => (
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

export default Business;
