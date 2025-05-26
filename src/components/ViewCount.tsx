
import React from 'react';
import { Eye } from 'lucide-react';
import { useViewTracking } from '../hooks/useViewTracking';

interface ViewCountProps {
  articleId: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ViewCount: React.FC<ViewCountProps> = ({ 
  articleId, 
  className = '', 
  showIcon = true,
  size = 'md'
}) => {
  const { viewCount, loading } = useViewTracking(articleId);

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-1 text-gray-500 ${sizeClasses[size]} ${className}`}>
        {showIcon && <Eye className={`${iconSizes[size]} animate-pulse`} />}
        <span className="animate-pulse">...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 text-gray-500 ${sizeClasses[size]} ${className}`}>
      {showIcon && <Eye className={iconSizes[size]} />}
      <span className="font-medium">
        {formatViewCount(viewCount)} view{viewCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default ViewCount;
