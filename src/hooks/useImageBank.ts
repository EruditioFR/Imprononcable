import { useState, useEffect } from 'react';
import { imageBankService } from '../services/airtable/services/imageBankService';
import type { Image } from '../types/gallery';

export function useImageBank(clientId?: string) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchImages() {
      try {
        setLoading(true);
        const data = await imageBankService.getImages(clientId);
        if (!mounted) return;
        setImages(data);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to fetch images'));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchImages();

    return () => {
      mounted = false;
    };
  }, [clientId]);

  return {
    images,
    loading,
    error,
  };
}