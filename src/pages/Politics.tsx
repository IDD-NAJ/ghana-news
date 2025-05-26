
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Politics = () => {
  const politicsNews = [
    {
      title: "Parliament Passes New Electoral Reforms Bill",
      excerpt: "The Ghanaian Parliament has unanimously passed comprehensive electoral reforms aimed at strengthening democratic processes and ensuring transparent elections in future political contests.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Political Correspondent",
      timeAgo: "1 hour ago",
      category: "Politics"
    },
    {
      title: "President Meets Opposition Leaders for National Dialogue",
      excerpt: "In a historic meeting, the President hosted opposition party leaders to discuss national unity and collaborative approaches to addressing Ghana's economic challenges.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "State House Reporter",
      timeAgo: "3 hours ago",
      category: "Politics"
    },
    {
      title: "Local Government Elections Set for December",
      excerpt: "The Electoral Commission announces dates for upcoming local government elections, emphasizing the importance of grassroots democracy in Ghana's political system.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Elections Desk",
      timeAgo: "5 hours ago",
      category: "Politics"
    },
    {
      title: "Minister of Finance Presents Mid-Year Budget Review",
      excerpt: "The Finance Minister outlines government's fiscal performance and adjustments to the national budget, addressing economic recovery measures and development priorities.",
      image: "photo-1531297484001-80022131f5a1",
      author: "Economic Reporter",
      timeAgo: "8 hours ago",
      category: "Politics"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-red pl-4">
                Politics
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {politicsNews.map((news, index) => (
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

export default Politics;
