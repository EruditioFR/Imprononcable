import React from 'react';
import { MultiSelect } from '../../ui/MultiSelect';

interface CategorySelectProps {
  value: string[];
  onChange: (categories: string[]) => void;
  disabled?: boolean;
}

export function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  // These would typically come from an API or configuration
  const categories = [
    'Portrait',
    'Paysage',
    'Architecture',
    'Nature',
    'Événement',
    'Produit'
  ];

  return (
    <MultiSelect
      options={categories.map(category => ({
        label: category,
        value: category
      }))}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner des catégories"
      disabled={disabled}
    />
  );
}