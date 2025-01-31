import React from 'react';
import { MultiSelect } from '../../ui/MultiSelect';

interface TagSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagSelect({ value, onChange, disabled }: TagSelectProps) {
  // These would typically come from an API or configuration
  const tags = [
    'Couleur',
    'Noir et blanc',
    'Intérieur',
    'Extérieur',
    'Urbain',
    'Rural',
    'Professionnel',
    'Lifestyle'
  ];

  return (
    <MultiSelect
      options={tags.map(tag => ({
        label: tag,
        value: tag
      }))}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner des tags"
      disabled={disabled}
    />
  );
}