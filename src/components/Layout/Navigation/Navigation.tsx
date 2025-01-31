import React from 'react';
import { MainNavigation } from './MainNavigation';
import { MobileNavigation } from './MobileNavigation';
import { AdminNavigation } from './AdminNavigation';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <MainNavigation />
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <AdminNavigation />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <MobileNavigation />
      </div>
    </nav>
  );
}