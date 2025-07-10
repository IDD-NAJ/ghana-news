
import React from 'react';
import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '../hooks/useArticles';
import ViewCount from './ViewCount';

interface NewsCardProps {
  article: Article;
  isLarge?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  isLarge = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const storyUrl = `/story/${article.slug}`;

  return (
    <Link to={storyUrl} className="block">
      <article 
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
          isLarge ? 'lg:flex' : ''
        }`}
      >
        <div className={`${isLarge ? 'lg:w-1/2' : ''} relative overflow-hidden`}>
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
                isLarge ? 'h-64 lg:h-full' : 'h-48'
              }`}
            />
          ) : (
            <div className={`bg-gray-200 flex items-center justify-center ${
              isLarge ? 'h-64 lg:h-full' : 'h-48'
            }`}>
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-slate-700 text-white px-3 py-1 text-xs font-semibold rounded-full">
              {article.category}
            </span>
          </div>
        </div>
        
        <div className={`p-4 sm:p-6 ${isLarge ? 'lg:w-1/2 flex flex-col justify-center' : ''}`}>
          <h2 className={`font-playfair font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-slate-600 transition-colors ${
            isLarge ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'
          }`}>
            {article.title}
          </h2>
          
          {article.excerpt && (
            <p className={`text-gray-600 mb-4 line-clamp-3 ${
              isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}>
              {article.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-4">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{article.author_name || article.author_email || 'News Desk'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <ViewCount 
              articleId={article.id} 
              size="sm"
              showIcon={false}
              className="hidden sm:flex"
            />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
