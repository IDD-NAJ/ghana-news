
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Technology = () => {
  const technologyNews = [
    {
      title: "Ghana Launches 5G Network Across Major Cities",
      excerpt: "Telecommunications companies rollout high-speed 5G infrastructure, promising to revolutionize internet connectivity and digital services nationwide.",
      image: "photo-1518770660439-4636190af475",
      author: "Tech Reporter",
      timeAgo: "30 minutes ago",
      category: "Technology"
    },
    {
      title: "AI Research Center Opens at University of Ghana",
      excerpt: "New artificial intelligence research facility aims to position Ghana as a leader in AI development and application across various sectors.",
      image: "photo-1487058792275-0ad4aaf24ca7",
      author: "Science Correspondent",
      timeAgo: "2 hours ago",
      category: "Technology"
    },
    {
      title: "Local App Developers Win International Coding Competition",
      excerpt: "Ghanaian software engineers triumph at global hackathon with innovative mobile application addressing local transportation challenges.",
      image: "photo-1498050108023-c5249f4df085",
      author: "Innovation Writer",
      timeAgo: "4 hours ago",
      category: "Technology"
    },
    {
      title: "E-Government Initiative Streamlines Public Services",
      excerpt: "Digital transformation project enables citizens to access government services online, reducing bureaucracy and improving efficiency.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Digital Government Reporter",
      timeAgo: "6 hours ago",
      category: "Technology"
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
                Technology
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technologyNews.map((news, index) => (
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

export default Technology;
