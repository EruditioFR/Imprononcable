import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © Imprononcable {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <Link 
              to="/mentions-legales" 
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              Mentions légales
            </Link>
            <Link 
              to="/politique-de-confidentialite" 
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}