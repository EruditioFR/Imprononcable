import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Home } from 'lucide-react';

export function MainNavigation() {
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
    </div>
  );
}