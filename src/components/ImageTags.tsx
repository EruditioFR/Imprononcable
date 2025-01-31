import React from 'react';

interface ImageTagsProps {
  tags: string[];
}

export const ImageTags: React.FC<ImageTagsProps> = ({ tags }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map((tag) => (
      <span
        key={tag}
        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
      >
        {tag}
      </span>
    ))}
  </div>
);