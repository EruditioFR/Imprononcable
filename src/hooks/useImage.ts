import { useState, useEffect } from 'react';
import { imageBankService } from '../services/airtable/services/imageBankService';
import type { ImageBankEntry } from '../types/imageBank';

export function useImage(id: string) {
  const [image, setImage] = useState<ImageBankEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const data = await imageBankService.getImage(id);
        setImage(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch image'));
        setImage(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImage();
    }
  }, [id]);

  return { image, loading, error };
}