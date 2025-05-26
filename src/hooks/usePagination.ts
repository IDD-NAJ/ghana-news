
import { useState, useCallback } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({ items, itemsPerPage }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const hasMore = currentPage < totalPages;
  
  const currentItems = items.slice(0, currentPage * itemsPerPage);
  
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);
  
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  return {
    currentItems,
    hasMore,
    loadMore,
    reset,
    currentPage,
    totalPages
  };
};
