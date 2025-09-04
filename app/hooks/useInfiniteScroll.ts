'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastLoadTime = useRef<number>(0);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    const now = Date.now();
    
    // Debounce to prevent multiple rapid calls (minimum 1 second between loads)
    if (target.isIntersecting && hasMore && !loading && (now - lastLoadTime.current) > 1000) {
      lastLoadTime.current = now;
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold, rootMargin]);

  return { loadMoreRef };
}