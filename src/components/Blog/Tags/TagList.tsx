import React from 'react';
import { Tag } from 'lucide-react';

interface TagListProps {
  tags: string[];
  light?: boolean;
}

export function TagList({ tags, light = false }: TagListProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Tag size={16} className={light ? 'text-white/80' : 'text-gray-400'} />
      {tags.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            light
              ? 'bg-white/20 text-white backdrop-blur-sm'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}