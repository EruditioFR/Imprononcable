import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/auth';

export function useRoleCheck() {
  const { user } = useAuth();

  const isAdmin = (): boolean => {
    return user?.role === 'Administrateur';
  };

  const isPresse = (): boolean => {
    return user?.role === 'Presse';
  };

  const isRegularUser = (): boolean => {
    return user?.role === 'Utilisateur';
  };

  const checkRole = (requiredRole: UserRole): boolean => {
    if (!user?.email) return false;
    return user.role === requiredRole;
  };

  return {
    isAdmin,
    isPresse,
    isRegularUser,
    checkRole,
    userRole: user?.role
  };
}