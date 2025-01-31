import { useMemo } from 'react';
import type { Image, CategoryCount } from '../types/gallery';

export function useCategoryFiltering(images: Image[], selectedCategories: string[]) {
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    images.forEach((image) => {
      image.categories.forEach((category) => {
        counts.set(category, (counts.get(category) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedCategories.length === 0) return images;
    return images.filter((image) =>
      selectedCategories.every((category) => image.categories.includes(category))
    );
  }, [images, selectedCategories]);

  return { categoryCounts, filteredImages };
}