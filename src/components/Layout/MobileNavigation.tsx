import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Home, FileText } from 'lucide-react';
import { useRoleCheck } from '../../hooks/useRoleCheck';

export function MobileNavigation() {
  const { isAdmin } = useRoleCheck();

  return (
    <div className="pt-2 pb-3 space-y-1">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
            isActive
              ? 'bg-primary-50 border-primary-500 text-primary-500'
              : 'border-transparent text-black hover:bg-gray-50 hover:border-secondary-300 hover:text-primary-500'
          }`
        }
      >
        <div className="flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Accueil
        </div>
      </NavLink>
      <NavLink
        to="/banque-images"
        className={({ isActive }) =>
          `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
            isActive
              ? 'bg-primary-50 border-primary-500 text-primary-500'
              : 'border-transparent text-black hover:bg-gray-50 hover:border-secondary-300 hover:text-primary-500'
          }`
        }
      >
        <div className="flex items-center">
          <Camera className="h-4 w-4 mr-2" />
          Banque d'images
        </div>
      </NavLink>
      {isAdmin() && (
        <NavLink
          to="/process-creatif"
          className={({ isActive }) =>
            `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive
                ? 'bg-primary-50 border-primary-500 text-primary-500'
                : 'border-transparent text-black hover:bg-gray-50 hover:border-secondary-300 hover:text-primary-500'
            }`
          }
        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Process Créatif
          </div>
        </NavLink>
      )}
    </div>
  );
}