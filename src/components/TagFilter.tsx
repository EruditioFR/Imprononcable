import React from 'react';
import { X } from 'lucide-react';
import { TagCount } from '../types/gallery';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  tagCounts: TagCount[];
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  tagCounts,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Filtrer par tags</h3>
      <div className="flex flex-wrap gap-2">
        {tagCounts.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-2 ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span>{tag}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              selectedTags.includes(tag)
                ? 'bg-blue-400'
                : 'bg-gray-200'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="ml-2 hover:text-blue-600"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};