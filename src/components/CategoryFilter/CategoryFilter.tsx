import React from 'react';
import type { CategoryCount } from '../../types/gallery';
import { CategoryButton } from './CategoryButton';
import { SelectedCategories } from './SelectedCategories';

interface CategoryFilterProps {
  categoryCounts: CategoryCount[];
  selectedCategories: string[];
  onCategorySelect: (category: string) => void;
  onCategoryRemove: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryCounts,
  selectedCategories,
  onCategorySelect,
  onCategoryRemove,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Filtrer par catégorie</h3>
      <div className="flex flex-wrap gap-2">
        {categoryCounts.map((categoryCount) => (
          <CategoryButton
            key={categoryCount.category}
            categoryCount={categoryCount}
            isSelected={selectedCategories.includes(categoryCount.category)}
            onSelect={onCategorySelect}
          />
        ))}
      </div>
      <SelectedCategories
        selectedCategories={selectedCategories}
        onRemove={onCategoryRemove}
      />
    </div>
  );
};