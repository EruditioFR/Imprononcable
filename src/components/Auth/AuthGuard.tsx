import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthorization } from '../../hooks/useAuthorization';
import { AlertTriangle } from 'lucide-react';
import type { UserRole } from '../../types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { hasRole } = useAuthorization();

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas accès à cette page
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}