import { useMemo } from 'react';
import type { Image, TagCount } from '../types/gallery';

export function useTagFiltering(images: Image[], selectedTags: string[]) {
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    images.forEach((image) => {
      image.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedTags.length === 0) return images;
    return images.filter((image) =>
      selectedTags.every((tag) => image.tags.includes(tag))
    );
  }, [images, selectedTags]);

  return { tagCounts, filteredImages };
}