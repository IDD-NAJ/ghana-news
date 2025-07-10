
import React, { useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useSearch } from '../hooks/useSearch';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { useViewTracking } from '../hooks/useViewTracking';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchResultItem = ({ article }: { article: any }) => {
  const { viewCount } = useViewTracking(article.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
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
    <div className="flex flex-col space-y-1">
      <div className="font-medium text-sm line-clamp-2">{article.title}</div>
      {article.excerpt && (
        <div className="text-xs text-gray-500 line-clamp-1">{article.excerpt}</div>
      )}
      <div className="flex items-center space-x-3 text-xs text-gray-400">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
          {article.category}
        </span>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(article.publication_date)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span>{formatViewCount(viewCount)}</span>
        </div>
      </div>
    </div>
  );
};

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useSearch(query);

  const handleSelect = (articleId: string, slug: string) => {
    onOpenChange(false);
    setQuery('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search articles..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="py-6 text-center text-sm text-gray-500">
            Searching...
          </div>
        )}
        
        {error && (
          <div className="py-6 text-center text-sm text-red-500">
            Error: {error}
          </div>
        )}
        
        {!loading && !error && query && results.length === 0 && (
          <CommandEmpty>No articles found.</CommandEmpty>
        )}
        
        {!loading && !error && results.length > 0 && (
          <CommandGroup heading="Articles">
            {results.map((article) => (
              <CommandItem
                key={article.id}
                value={article.title}
                onSelect={() => handleSelect(article.id, article.slug)}
                asChild
              >
                <Link
                  to={`/story/${article.slug}`}
                  className="block w-full"
                  onClick={() => onOpenChange(false)}
                >
                  <SearchResultItem article={article} />
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {!query && (
          <div className="py-6 text-center text-sm text-gray-500">
            Type to search articles...
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
