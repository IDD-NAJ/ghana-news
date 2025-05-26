
import React from 'react';
import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  timeAgo: string;
  category: string;
  isLarge?: boolean;
  id?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  image,
  author,
  timeAgo,
  category,
  isLarge = false,
  id = '1'
}) => {
  // Generate slug from title for better URLs
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const storyUrl = `/story/${id}/${slug}`;

  return (
    <Link to={storyUrl} className="block">
      <article 
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
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
            <span className="bg-slate-700 text-white px-3 py-1 text-xs font-semibold rounded-full">
              {category}
            </span>
          </div>
        </div>
        
        <div className={`p-6 ${isLarge ? 'lg:w-1/2 flex flex-col justify-center' : ''}`}>
          <h2 className={`font-playfair font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-slate-600 transition-colors ${
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
    </Link>
  );
};

export default NewsCard;
