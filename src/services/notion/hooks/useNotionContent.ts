import { useState, useEffect } from 'react';
import { NotionClient } from '../client';
import type { NotionBlock } from '../types';
import { NotionError } from '../errors';
import { logError, logInfo } from '../utils/logging';

export function useNotionContent(pageId: string) {
  const [content, setContent] = useState<NotionBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const client = new NotionClient();

    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);

        logInfo('Fetching Notion content', { pageId });
        const blocks = await client.getPageContent(pageId);
        
        if (!mounted) return;
        
        logInfo('Content fetched successfully', { 
          blockCount: blocks.length 
        });
        
        setContent(blocks);
      } catch (err) {
        logError('Failed to fetch content', err);
        if (!mounted) return;
        
        setError(
          err instanceof NotionError 
            ? err 
            : new Error('Failed to fetch content')
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (pageId) {
      fetchContent();
    }

    return () => {
      mounted = false;
    };
  }, [pageId]);

  return { content, loading, error };
}