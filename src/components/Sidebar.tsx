
import React from 'react';
import { TrendingUp, Calendar, Tag } from 'lucide-react';

const Sidebar = () => {
  const trendingNews = [
    {
      title: "Black Stars prepare for AFCON qualifiers",
      views: "12.5K",
      time: "2 hours ago"
    },
    {
      title: "Ghana's economy shows positive growth",
      views: "8.2K",
      time: "4 hours ago"
    },
    {
      title: "New tech hub opens in Accra",
      views: "6.1K",
      time: "6 hours ago"
    },
    {
      title: "Educational reforms announced",
      views: "5.8K",
      time: "8 hours ago"
    }
  ];

  const categories = [
    { name: "Politics", count: 45, color: "bg-ghana-red" },
    { name: "Sports", count: 32, color: "bg-ghana-green" },
    { name: "Entertainment", count: 28, color: "bg-ghana-gold" },
    { name: "Business", count: 24, color: "bg-blue-500" },
    { name: "Technology", count: 18, color: "bg-purple-500" },
    { name: "Lifestyle", count: 15, color: "bg-pink-500" }
  ];

  return (
    <aside className="space-y-8">
      {/* Trending News */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-5 h-5 text-ghana-red mr-2" />
          <h3 className="text-xl font-playfair font-semibold text-gray-900">Trending Now</h3>
        </div>
        
        <div className="space-y-4">
          {trendingNews.map((news, index) => (
            <div key={index} className="group cursor-pointer">
              <h4 className="font-medium text-gray-900 group-hover:text-ghana-red transition-colors mb-2 line-clamp-2">
                {news.title}
              </h4>
              <div className="flex items-center text-sm text-gray-500 space-x-3">
                <span>{news.views} views</span>
                <span>•</span>
                <span>{news.time}</span>
              </div>
              {index < trendingNews.length - 1 && <hr className="mt-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Tag className="w-5 h-5 text-ghana-green mr-2" />
          <h3 className="text-xl font-playfair font-semibold text-gray-900">Categories</h3>
        </div>
        
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                <span className="text-gray-700 group-hover:text-ghana-red transition-colors">
                  {category.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-ghana-red to-ghana-gold rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 mr-2" />
          <h3 className="text-xl font-playfair font-semibold">Stay Updated</h3>
        </div>
        <p className="mb-4 text-sm opacity-90">
          Get the latest Ghana news delivered to your inbox daily.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="w-full bg-white text-ghana-red font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
