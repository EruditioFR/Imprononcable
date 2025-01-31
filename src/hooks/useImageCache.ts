import { useState, useEffect } from 'react';

interface CacheStatus {
  loaded: boolean;
  error: boolean;
}

const imageCache = new Map<string, CacheStatus>();

export function useImageCache(urls: string[]) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const uncachedUrls = urls.filter(url => !imageCache.has(url));

    if (uncachedUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let completedCount = 0;

    uncachedUrls.forEach(url => {
      const img = new Image();
      
      img.onload = () => {
        if (!mounted) return;
        imageCache.set(url, { loaded: true, error: false });
        completedCount++;
        setLoadedCount(prev => prev + 1);
        
        if (completedCount === uncachedUrls.length) {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        if (!mounted) return;
        imageCache.set(url, { loaded: false, error: true });
        completedCount++;
        
        if (completedCount === uncachedUrls.length) {
          setIsLoading(false);
        }
      };

      // Add cache-control headers to the request
      const cacheBuster = `?cache=${Date.now()}`;
      img.src = `${url}${cacheBuster}`;
    });

    return () => {
      mounted = false;
    };
  }, [urls]);

  return {
    isLoading,
    loadedCount,
    totalCount: urls.length,
    progress: Math.round((loadedCount / urls.length) * 100)
  };
}