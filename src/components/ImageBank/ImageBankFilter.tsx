import React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { useClients } from '../../hooks/useClients';
import { MultiSelect } from '../ui/MultiSelect';

interface ImageBankFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  selectedClient: string;
  onClientChange: (clientId: string) => void;
}

export function ImageBankFilter({
  selectedCategories,
  onCategoryChange,
  selectedTags,
  onTagChange,
  selectedClient,
  onClientChange
}: ImageBankFilterProps) {
  const { categories } = useCategories();
  const { tags } = useTags();
  const { clients } = useClients();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filtrer par catégorie
        </label>
        <MultiSelect
          options={categories.map(cat => ({ label: cat, value: cat }))}
          value={selectedCategories}
          onChange={onCategoryChange}
          placeholder="Sélectionner des catégories"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filtrer par tag
        </label>
        <MultiSelect
          options={tags.map(tag => ({ label: tag, value: tag }))}
          value={selectedTags}
          onChange={onTagChange}
          placeholder="Sélectionner des tags"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filtrer par client
        </label>
        <select
          value={selectedClient}
          onChange={(e) => onClientChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Tous les clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}