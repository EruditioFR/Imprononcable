import { useState, useEffect } from 'react';
import { imageBankService } from '../services/airtable/services/imageBankService';

export function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const images = await imageBankService.getImages();
        const uniqueTags = [...new Set(images.flatMap(img => img.tags))];
        setTags(uniqueTags.sort());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tags'));
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}