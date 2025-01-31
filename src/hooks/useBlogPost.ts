import { useState, useEffect } from 'react';
import { blogService } from '../services/airtable/services/blogService';
import type { BlogPost } from '../types/blog';

export function useBlogPost(id: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPost() {
      try {
        const data = await blogService.getBlogPost(id);
        if (!mounted) return;
        setPost(data);
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

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { post, loading, error };
}