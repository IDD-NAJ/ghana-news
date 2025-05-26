
import React from 'react';
import { Clock, User } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  timeAgo: string;
  category: string;
  isLarge?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  image,
  author,
  timeAgo,
  category,
  isLarge = false
}) => {
  return (
    <article 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isLarge ? 'lg:flex' : ''
      }`}
    >
      <div className={`${isLarge ? 'lg:w-1/2' : ''} relative overflow-hidden`}>
        <img
          src={`https://images.unsplash.com/${image}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80`}
          alt={title}
          className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
            isLarge ? 'h-64 lg:h-full' : 'h-48'
          }`}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-ghana-red text-white px-3 py-1 text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className={`p-6 ${isLarge ? 'lg:w-1/2 flex flex-col justify-center' : ''}`}>
        <h2 className={`font-playfair font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-ghana-red transition-colors cursor-pointer ${
          isLarge ? 'text-2xl lg:text-3xl' : 'text-xl'
        }`}>
          {title}
        </h2>
        
        <p className={`text-gray-600 mb-4 line-clamp-3 ${
          isLarge ? 'text-lg' : 'text-base'
        }`}>
          {excerpt}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
