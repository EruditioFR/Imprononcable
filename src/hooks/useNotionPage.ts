import { useState, useEffect } from 'react';
import { NotionClient } from '../services/notion/client';
import type { NotionBlock, NotionPage } from '../services/notion/types';
import { NotionError } from '../services/notion/errors';

export function useNotionPage(pageId?: string) {
  const [content, setContent] = useState<NotionBlock[]>([]);
  const [page, setPage] = useState<NotionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const notionClient = new NotionClient();

    async function fetchPage() {
      try {
        setLoading(true);
        setError(null);

        const [pageData, contentData] = await Promise.all([
          notionClient.getPage(pageId),
          notionClient.getPageContent(pageId)
        ]);

        if (!mounted) return;

        setPage(pageData as NotionPage);
        setContent(contentData);
      } catch (err) {
        console.error('Failed to fetch Notion page:', err);
        if (!mounted) return;
        
        if (err instanceof NotionError) {
          setError(err);
        } else {
          setError(new Error('Failed to fetch page'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPage();

    return () => {
      mounted = false;
    };
  }, [pageId]);

  return { page, content, loading, error };
}