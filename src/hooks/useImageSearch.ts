import { useMemo } from 'react';
import type { Image } from '../types/gallery';
import { searchInAllFields } from '../utils/searchUtils';

export function useImageSearch(images: Image[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim() || !Array.isArray(images)) {
      return images;
    }

    // Log pour le debugging
    console.log('Searching images with query:', searchQuery);

    const filteredImages = images.filter(image => {
      const matches = searchInAllFields(image, searchQuery);
      
      // Log les résultats pour le debugging
      if (matches && image['tags proposés']?.length > 0) {
        console.log('Image matched with tags proposés:', {
          title: image.title,
          tagsProposés: image['tags proposés']
        });
      }
      
      return matches;
    });

    console.log('Search results:', {
      total: images.length,
      filtered: filteredImages.length
    });

    return filteredImages;
  }, [images, searchQuery]);
}