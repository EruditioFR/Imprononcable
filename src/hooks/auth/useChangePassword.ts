import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { ChangePasswordFormData } from '../../types/auth';

export function useChangePassword() {
  const { changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      await changePassword(data.currentPassword, data.newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec du changement de mot de passe');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleChangePassword,
    isLoading,
    error,
    success
  };
}