
import React from 'react';
import { TrendingUp, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrendingArticles } from '../hooks/useTrendingArticles';
import { useViewTracking } from '../hooks/useViewTracking';
import NewsletterSubscription from './NewsletterSubscription';

const TrendingArticleItem = ({ article, index }: { article: any, index: number }) => {
  const { viewCount } = useViewTracking(article.id);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} weeks ago`;
    }
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="group">
      <Link 
        to={`/story/${article.id}/${article.slug}`}
        className="block cursor-pointer"
      >
        <h4 className="font-medium text-gray-900 group-hover:text-ghana-red transition-colors mb-2 line-clamp-2">
          {article.title}
        </h4>
        <div className="flex items-center text-sm text-gray-500 space-x-3">
          <span>{formatViewCount(viewCount)} views</span>
          <span>•</span>
          <span>{formatTimeAgo(article.publication_date)}</span>
        </div>
      </Link>
      {index < 3 && <hr className="mt-4" />}
    </div>
  );
};

const Sidebar = () => {
  const { trendingArticles, loading } = useTrendingArticles(4);

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
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                {index < 3 && <hr className="mt-4" />}
              </div>
            ))}
          </div>
        ) : trendingArticles.length > 0 ? (
          <div className="space-y-4">
            {trendingArticles.map((article, index) => (
              <TrendingArticleItem key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No trending articles at the moment.</p>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Tag className="w-5 h-5 text-ghana-green mr-2" />
          <h3 className="text-xl font-playfair font-semibold text-gray-900">Categories</h3>
        </div>
        
        <div className="space-y-3">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={`/${category.name.toLowerCase()}`}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                <span className="text-gray-700 group-hover:text-ghana-red transition-colors">
                  {category.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterSubscription />
    </aside>
  );
};

export default Sidebar;
