import { useMemo } from 'react';
import type { Image } from '../types/gallery';

export function useRightsFiltering(images: Image[], activeRights: 'all' | 'active' | 'expired') {
  return useMemo(() => {
    const filteredImages = activeRights === 'all'
      ? images
      : activeRights === 'active'
        ? images.filter(img => !img.rights.isExpired)
        : images.filter(img => img.rights.isExpired);

    const expiredCount = images.filter(img => img.rights.isExpired).length;
    const activeCount = images.filter(img => !img.rights.isExpired).length;

    return {
      filteredImages,
      expiredCount,
      activeCount
    };
  }, [images, activeRights]);
}