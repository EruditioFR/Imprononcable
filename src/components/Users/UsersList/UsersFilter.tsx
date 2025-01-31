import React from 'react';
import { Search } from 'lucide-react';
import type { UserRole } from '../../../types/user';

interface UsersFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

export function UsersFilter({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange
}: UsersFilterProps) {
  const roles: UserRole[] = ['Administrateur', 'Utilisateur'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      
      <div className="sm:w-64">
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tous les rôles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}