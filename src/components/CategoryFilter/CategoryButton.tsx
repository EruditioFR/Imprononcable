import React from 'react';
import type { CategoryCount } from '../../types/gallery';

interface CategoryButtonProps {
  categoryCount: CategoryCount;
  isSelected: boolean;
  onSelect: (category: string) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  categoryCount: { category, count }, 
  isSelected, 
  onSelect 
}) => (
  <button
    onClick={() => onSelect(category)}
    className={`h-10 px-4 rounded-lg text-sm transition-colors flex items-center gap-2 ${
      isSelected
        ? 'text-white hover:bg-opacity-90'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    }`}
    style={isSelected ? { backgroundColor: '#055E4C' } : undefined}
  >
    <span>{category}</span>
    <span className={`px-2 py-0.5 rounded-full ${
      isSelected ? 'bg-opacity-40 bg-white' : 'bg-gray-200'
    }`}>
      {count}
    </span>
  </button>
);