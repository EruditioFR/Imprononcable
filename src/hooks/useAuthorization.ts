import { useAuth } from '../contexts/AuthContext';

export function useAuthorization() {
  const { user } = useAuth();

  const isAdmin = (): boolean => {
    return user?.role === 'Administrateur';
  };

  const hasRole = (requiredRole: string): boolean => {
    return user?.role === requiredRole;
  };

  return {
    isAdmin,
    hasRole,
    userRole: user?.role
  };
}