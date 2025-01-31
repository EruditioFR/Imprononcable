import React from 'react';
import { X } from 'lucide-react';

interface SelectedCategoriesProps {
  selectedCategories: string[];
  onRemove: (category: string) => void;
}

export const SelectedCategories: React.FC<SelectedCategoriesProps> = ({ 
  selectedCategories, 
  onRemove 
}) => {
  if (selectedCategories.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {selectedCategories.map((category) => (
        <span
          key={category}
          className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          {category}
          <button
            onClick={() => onRemove(category)}
            className="ml-2 hover:text-blue-600"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
};