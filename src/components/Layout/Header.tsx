import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings } from 'lucide-react';
import { ChangePasswordModal } from '../Auth/ChangePasswordModal';

const roleLabels = {
  'Administrateur': 'Admin',
  'Utilisateur': 'Utilisateur',
  'Presse': 'Presse'
} as const;

export function Header() {
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-2xl font-display font-bold text-secondary-500 hover:text-primary-600 transition-colors"
            >
              CollabSpace
            </Link>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-secondary-400">{user.email}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    user.role === 'Administrateur' 
                      ? 'bg-blue-100 text-blue-800'
                      : user.role === 'Presse'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {roleLabels[user.role]}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-md text-secondary-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ChangePasswordModal 
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}