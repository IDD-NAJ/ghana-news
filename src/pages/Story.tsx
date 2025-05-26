
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample story data - in a real app, this would come from an API or database
  const storyData = {
    title: "President Akufo-Addo Announces Major Infrastructure Development Plan for Northern Ghana",
    content: `
      <p>In a landmark announcement that promises to reshape the economic landscape of northern Ghana, President Nana Addo Dankwa Akufo-Addo unveiled an ambitious infrastructure development plan worth over GH₵15 billion during a state visit to Tamale yesterday.</p>
      
      <p>The comprehensive plan includes the construction of four new regional hospitals, 200 kilometers of new roads connecting major towns, three technical universities, and a modern airport in Wa. The President emphasized that this initiative represents the largest single investment in northern Ghana's infrastructure since independence.</p>
      
      <h3>Key Components of the Development Plan</h3>
      
      <p><strong>Healthcare Infrastructure:</strong> The new hospitals will be built in Tamale, Bolgatanga, Wa, and Yendi, each equipped with modern medical equipment and specialist departments. These facilities are expected to serve over 2 million people and reduce the burden on southern Ghana's healthcare system.</p>
      
      <p><strong>Transportation Network:</strong> The road construction project will focus on connecting agricultural areas to major markets, facilitating the movement of goods and people. Priority routes include the Tamale-Yendi highway and the Wa-Hamile border road.</p>
      
      <p><strong>Educational Facilities:</strong> Three new technical universities will be established to provide specialized training in agriculture, renewable energy, and information technology, addressing the region's specific economic needs.</p>
      
      <h3>Economic Impact and Job Creation</h3>
      
      <p>Government economists project that the infrastructure development will create over 50,000 direct jobs during the construction phase and approximately 100,000 indirect jobs in supporting industries. The plan is expected to boost the region's GDP by 25% over the next five years.</p>
      
      <p>Local chiefs and opinion leaders have welcomed the announcement, with the Overlord of Dagbon, Ya-Na Abukari II, describing it as "a new dawn for the northern regions." The traditional leader pledged full support for the project and called for unity among communities to ensure its success.</p>
      
      <h3>Implementation Timeline</h3>
      
      <p>The project will be implemented in three phases over seven years, with groundbreaking ceremonies scheduled to begin in the second quarter of 2025. The government has secured funding through a combination of domestic resources, international development loans, and private sector partnerships.</p>
      
      <p>President Akufo-Addo emphasized that the project represents a commitment to balanced national development and will help bridge the economic gap between northern and southern Ghana. "No region should be left behind in our march toward prosperity," the President stated during his address to regional stakeholders.</p>
      
      <p>The announcement comes as Ghana continues to recover from recent economic challenges, with the government positioning infrastructure development as a key driver of economic growth and job creation.</p>
    `,
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Kwame Asante",
    timeAgo: "1 hour ago",
    category: "Politics",
    readTime: "5 min read",
    publishDate: "Friday, May 26, 2025"
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = storyData.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-ghana-red transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to News</span>
            </button>

            {/* Article Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/${storyData.image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80`}
                  alt={storyData.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-ghana-red text-white px-3 py-1 text-sm font-semibold rounded-full">
                    {storyData.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
                  {storyData.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{storyData.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{storyData.timeAgo}</span>
                    </div>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                      {storyData.readTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <span className="text-gray-600 text-sm">Share:</span>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: storyData.content }}
                />
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Published on {storyData.publishDate}
                  </p>
                </div>
              </div>
            </div>
          </article>
          
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

export default Story;
