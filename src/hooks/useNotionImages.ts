import { useState, useEffect } from 'react';
import type { Image } from '../types/gallery';
import { NotionService } from '../services/notion';
import { galleryImages } from '../data/mockData';

const notionService = new NotionService(
  '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',
  '14c686c5c9f180589f49c77e1bf8e140'
);

export function useNotionImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      try {
        const notionImages = await notionService.getImages();
        
        if (!mounted) return;

        if (notionImages.length === 0) {
          console.warn('No images found in Notion, falling back to mock data');
          setImages(galleryImages);
          setLoading(false);
          return;
        }

        // Load actual image dimensions
        const imagesWithDimensions = await Promise.all(
          notionImages.map(async (image) => {
            return new Promise<Image>((resolve) => {
              const imgElement = new window.Image();
              imgElement.onload = () => {
                resolve({
                  ...image,
                  width: imgElement.width,
                  height: imgElement.height,
                });
              };
              imgElement.onerror = () => {
                console.warn(`Failed to load image dimensions for ${image.url}`);
                resolve(image);
              };
              imgElement.src = image.url;
            });
          })
        );

        if (!mounted) return;
        setImages(imagesWithDimensions);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load images from Notion:', err);
        if (!mounted) return;
        console.warn('Falling back to mock data');
        setImages(galleryImages);
        setError(err instanceof Error ? err : new Error('Failed to load images'));
        setLoading(false);
      }
    }

    loadImages();

    return () => {
      mounted = false;
    };
  }, []);

  return { images, loading, error };
}