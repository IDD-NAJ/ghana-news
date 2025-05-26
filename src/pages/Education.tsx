
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Education = () => {
  const educationNews = [
    {
      id: "6",
      title: "New University Campus Opens in Tamale",
      excerpt: "The University of Ghana inaugurates a state-of-the-art campus in Tamale, expanding access to higher education in the northern regions and promoting academic excellence.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Education Reporter",
      timeAgo: "6 hours ago",
      category: "Education"
    },
    {
      id: "20",
      title: "Government Launches Free Coding Program for Youth",
      excerpt: "Ministry of Education partners with tech companies to provide free programming courses to young Ghanaians, aiming to bridge the digital skills gap.",
      image: "photo-1522202176988-66273c2fd55f",
      author: "Tech Education Correspondent",
      timeAgo: "8 hours ago",
      category: "Education"
    },
    {
      id: "21",
      title: "Primary School Enrollment Reaches All-Time High",
      excerpt: "Latest statistics show record-breaking enrollment numbers in primary schools across Ghana, with significant improvements in rural areas.",
      image: "photo-1503676260728-1c00da094a0b",
      author: "Education Statistics Team",
      timeAgo: "12 hours ago",
      category: "Education"
    },
    {
      id: "22",
      title: "Teachers' Union Negotiates Better Working Conditions",
      excerpt: "Ghana National Association of Teachers reaches agreement with government on improved salaries and professional development opportunities.",
      image: "photo-1544717297-fa95b6ee9643",
      author: "Labor Relations Reporter",
      timeAgo: "1 day ago",
      category: "Education"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="animate-fade-in-up">
              <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-green pl-4">
                Education News
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Stay updated with the latest developments in Ghana's education sector, from policy changes to institutional achievements.
              </p>
            </section>

            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationNews.map((news, index) => (
                  <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard {...news} />
                  </div>
                ))}
              </div>
            </section>

            <div className="text-center pt-8">
              <button className="bg-ghana-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Load More Education Stories
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

export default Education;
