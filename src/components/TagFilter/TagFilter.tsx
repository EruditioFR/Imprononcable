import React from 'react';
import type { TagCount } from '../../types/gallery';
import { TagButton } from './TagButton';
import { SelectedTags } from './SelectedTags';

interface TagFilterProps {
  tagCounts: TagCount[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tagCounts,
  selectedTags,
  onTagSelect,
  onTagRemove,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Filtrer par tags</h3>
      <div className="flex flex-wrap gap-2">
        {tagCounts.map((tagCount) => (
          <TagButton
            key={tagCount.tag}
            tagCount={tagCount}
            isSelected={selectedTags.includes(tagCount.tag)}
            onSelect={onTagSelect}
          />
        ))}
      </div>
      <SelectedTags
        selectedTags={selectedTags}
        onRemove={onTagRemove}
      />
    </div>
  );
};