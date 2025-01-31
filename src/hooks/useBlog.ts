import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/airtable/services/blogService';
import type { BlogPost, BlogFormData } from '../types/blog';
import { AirtableError } from '../services/airtable/errors';

export function useBlog(publishedOnly: boolean = false) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticles = async () => {
    if (!user) {
      setError(new Error('Vous devez être connecté pour accéder aux articles'));
      setLoading(false);
      return;
    }

    try {
      const fetchedArticles = await blogService.getArticles(publishedOnly);
      setArticles(fetchedArticles);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError(
        err instanceof AirtableError 
          ? err 
          : new Error('Impossible de charger les articles')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [user, publishedOnly]);

  const deleteArticle = async (id: string): Promise<void> => {
    try {
      await blogService.deleteArticle(id);
      // Refresh the articles list after successful deletion
      await fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      throw error instanceof Error ? error : new Error('Failed to delete article');
    }
  };

  const createArticle = async (data: BlogFormData): Promise<void> => {
    try {
      await blogService.createArticle(data);
      await fetchArticles();
    } catch (error) {
      console.error('Failed to create article:', error);
      throw error instanceof Error ? error : new Error('Failed to create article');
    }
  };

  const updateArticle = async (id: string, data: BlogFormData): Promise<void> => {
    try {
      await blogService.updateArticle(id, data);
      await fetchArticles();
    } catch (error) {
      console.error('Failed to update article:', error);
      throw error instanceof Error ? error : new Error('Failed to update article');
    }
  };

  return {
    articles,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle
  };
}