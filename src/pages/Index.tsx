
import React from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Index = () => {
  const featuredNews = {
    title: "President Akufo-Addo Announces Major Infrastructure Development Plan for Northern Ghana",
    excerpt: "In a landmark announcement, the President outlined ambitious plans to transform the northern regions with new roads, hospitals, and educational facilities, marking a significant investment in the area's development.",
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Kwame Asante",
    timeAgo: "1 hour ago",
    category: "Politics"
  };

  const mainNews = [
    {
      title: "Black Stars Coach Names Squad for Upcoming AFCON Qualifiers",
      excerpt: "Ghana's national football team coach has announced a 25-man squad featuring both experienced players and promising newcomers for the crucial African Cup of Nations qualifying matches.",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Sports Desk",
      timeAgo: "2 hours ago",
      category: "Sports"
    },
    {
      title: "Ghana's Digital Economy Surges with New Fintech Innovations",
      excerpt: "Local technology companies are revolutionizing the financial sector with groundbreaking mobile money solutions and digital banking platforms, positioning Ghana as a fintech leader in West Africa.",
      image: "photo-1518770660439-4636190af475",
      author: "Tech Reporter",
      timeAgo: "3 hours ago",
      category: "Technology"
    },
    {
      title: "Cocoa Farmers Benefit from New Government Support Program",
      excerpt: "The Ministry of Agriculture launches comprehensive support initiative providing subsidized farming equipment and training to boost cocoa production and improve farmer livelihoods.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Agricultural Correspondent",
      timeAgo: "4 hours ago",
      category: "Business"
    },
    {
      title: "Ghanaian Film Industry Gains International Recognition",
      excerpt: "Local filmmakers receive acclaim at international festivals, showcasing Ghana's rich storytelling tradition and cementing the country's position in global cinema.",
      image: "photo-1526374965328-7f61d4dc18c5",
      author: "Entertainment Writer",
      timeAgo: "5 hours ago",
      category: "Entertainment"
    },
    {
      title: "New University Campus Opens in Tamale",
      excerpt: "The University of Ghana inaugurates a state-of-the-art campus in Tamale, expanding access to higher education in the northern regions and promoting academic excellence.",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Education Reporter",
      timeAgo: "6 hours ago",
      category: "Education"
    },
    {
      title: "Traditional Chiefs Meet to Discuss Land Management",
      excerpt: "Traditional authorities from across Ghana convene to address modern challenges in land administration while preserving cultural heritage and customary practices.",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Cultural Affairs",
      timeAgo: "7 hours ago",
      category: "Culture"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            <section className="animate-fade-in-up">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-red pl-4">
                Featured Story
              </h2>
              <NewsCard
                {...featuredNews}
                isLarge={true}
              />
            </section>

            {/* Latest News Grid */}
            <section>
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6 border-l-4 border-ghana-green pl-4">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainNews.map((news, index) => (
                  <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard {...news} />
                  </div>
                ))}
              </div>
            </section>

            {/* Load More Button */}
            <div className="text-center pt-8">
              <button className="bg-ghana-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Load More Stories
              </button>
            </div>
          </div>

          {/* Sidebar */}
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

export default Index;
