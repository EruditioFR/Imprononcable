import React from 'react';
import { useRoleCheck } from '../hooks/useRoleCheck';
import type { UserRole } from '../types/auth';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { checkRole } = useRoleCheck();

  if (!checkRole(requiredRole)) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas les droits nécessaires pour accéder à cette page
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}