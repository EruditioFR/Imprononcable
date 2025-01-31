import React from 'react';
import type { TagCount } from '../../types/gallery';

interface TagButtonProps {
  tagCount: TagCount;
  isSelected: boolean;
  onSelect: (tag: string) => void;
}

export const TagButton: React.FC<TagButtonProps> = ({ 
  tagCount: { tag, count }, 
  isSelected, 
  onSelect 
}) => (
  <button
    onClick={() => onSelect(tag)}
    className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-2 ${
      isSelected
        ? 'text-white hover:bg-opacity-90'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    }`}
    style={isSelected ? { backgroundColor: '#055E4C' } : undefined}
  >
    <span>{tag}</span>
    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
      isSelected ? 'bg-opacity-40 bg-white' : 'bg-gray-200'
    }`}>
      {count}
    </span>
  </button>
);