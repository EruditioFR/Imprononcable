import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Home, FileText, Newspaper, Album } from 'lucide-react';
import { useRoleCheck } from '../../../hooks/useRoleCheck';

export function MainNavigation() {
  const { isAdmin } = useRoleCheck();

  return (
    <div className="flex space-x-8">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
            isActive
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-black hover:border-secondary-300 hover:text-primary-500'
          }`
        }
      >
        <Home className="h-4 w-4 mr-2" />
        Accueil
      </NavLink>

      <NavLink
        to="/banque-images"
        className={({ isActive }) =>
          `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
            isActive
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-black hover:border-secondary-300 hover:text-primary-500'
          }`
        }
      >
        <Camera className="h-4 w-4 mr-2" />
        Banque d'images
      </NavLink>

      <NavLink
        to="/ressources"
        className={({ isActive }) =>
          `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
            isActive
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-black hover:border-secondary-300 hover:text-primary-500'
          }`
        }
      >
        <FileText className="h-4 w-4 mr-2" />
        Ressources
      </NavLink>

      <NavLink
        to="/ensemble"
        className={({ isActive }) =>
          `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
            isActive
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-black hover:border-secondary-300 hover:text-primary-500'
          }`
        }
      >
        <Newspaper className="h-4 w-4 mr-2" />
        Ensemble
      </NavLink>

      {isAdmin() && (
        <NavLink
          to="/shared-albums/manage"
          className={({ isActive }) =>
            `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
              isActive
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-black hover:border-secondary-300 hover:text-primary-500'
            }`
          }
        >
          <Album className="h-4 w-4 mr-2" />
          Albums partagés
        </NavLink>
      )}
    </div>
  );
}