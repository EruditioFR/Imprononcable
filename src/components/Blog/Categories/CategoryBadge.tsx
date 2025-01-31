import React from 'react';

interface CategoryBadgeProps {
  category: string;
  light?: boolean;
}

export function CategoryBadge({ category, light = false }: CategoryBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
      light 
        ? 'text-white bg-primary-500/80 backdrop-blur-sm' 
        : 'text-primary-700 bg-primary-50'
    }`}>
      {category}
    </span>
  );
}