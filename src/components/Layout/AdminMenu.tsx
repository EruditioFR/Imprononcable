import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Settings, FileText } from 'lucide-react';
import { useRoleCheck } from '../../hooks/useRoleCheck';

export function AdminMenu() {
  const { isAdmin } = useRoleCheck();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin()) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:text-primary-500 transition-colors"
      >
        <Settings className="h-4 w-4" />
        Administration
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <NavLink
              to="/process-creatif"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm ${
                  isActive
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-black hover:bg-gray-50 hover:text-primary-500'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Process Créatif
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}