import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface ImageBankFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function ImageBankFilters({
  searchQuery,
  onSearchChange,
  selectedFormat,
  onFormatChange,
  selectedTags,
  onTagsChange
}: ImageBankFiltersProps) {
  const [tagInput, setTagInput] = useState('');
  const formats = ['Portrait', 'Paysage'];

  const handleAddTag = () => {
    if (tagInput.trim()) {
      onTagsChange([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rechercher
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher par titre projet ou mots-clés..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Format filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => onFormatChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Tous les formats</option>
              {formats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          {/* Tags filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mots-clés
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un mot-clé"
                className="flex-1 border border-gray-300 rounded-lg py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Appuyez sur Entrée ou cliquez sur + pour ajouter un mot-clé
            </p>
          </div>
        </div>

        {/* Active filters */}
        {(selectedFormat || selectedTags.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedFormat && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Format: {selectedFormat}
                <button
                  onClick={() => onFormatChange('')}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {tag}
                <button
                  onClick={() => onTagsChange(selectedTags.filter(t => t !== tag))}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}