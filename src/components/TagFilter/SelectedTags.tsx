import React from 'react';
import { X } from 'lucide-react';

interface SelectedTagsProps {
  selectedTags: string[];
  onRemove: (tag: string) => void;
}

export const SelectedTags: React.FC<SelectedTagsProps> = ({ 
  selectedTags, 
  onRemove 
}) => {
  if (selectedTags.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {selectedTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          {tag}
          <button
            onClick={() => onRemove(tag)}
            className="ml-2 hover:text-blue-600"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
};