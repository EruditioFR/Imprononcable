import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { RightsFilter } from '../RightsFilter/RightsFilter';
import type { Client } from '../../types/client';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeRights: 'all' | 'active' | 'expired';
  onRightsChange: (rights: 'all' | 'active' | 'expired') => void;
  expiredCount: number;
  activeCount: number;
  selectedFormat: string | null;
  onFormatSelect: (format: string | null) => void;
  selectedClient: string;
  onClientChange: (clientId: string) => void;
  clients: Client[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeRights,
  onRightsChange,
  expiredCount,
  activeCount,
  selectedClient,
  onClientChange,
  clients
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        {/* Search field - 60% width */}
        <div className="flex-1">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
        
        {/* Client filter - 40% width */}
        <div className="w-[40%]">
          <select
            value={selectedClient}
            onChange={(e) => onClientChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg h-10 pl-3 pr-10 focus:ring-primary-500 focus:border-primary-500"
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

      <div className="flex justify-end">
        <RightsFilter
          activeRights={activeRights}
          onRightsChange={onRightsChange}
          expiredCount={expiredCount}
          activeCount={activeCount}
        />
      </div>
    </div>
  );
};