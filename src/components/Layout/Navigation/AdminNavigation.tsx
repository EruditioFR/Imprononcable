import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, ChevronDown } from 'lucide-react';
import { useRoleCheck } from '../../../hooks/useRoleCheck';

export function AdminNavigation() {
  const { isAdmin } = useRoleCheck();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin()) return null;

  return (
    <div className="relative">
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 text-sm font-medium ${
            isActive
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-primary-500'
          }`
        }
      >
        <Settings className="h-4 w-4" />
        Administration
      </NavLink>
    </div>
  );
}