import { useState, useEffect } from 'react';
import { blogService } from '../services/airtable/services/blogService';
import type { BlogPost } from '../types/blog';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPosts() {
      try {
        const data = await blogService.getBlogPosts();
        if (!mounted) return;
        setPosts(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return { posts, loading, error };
}