import { useState } from 'react';
import { userService } from '../services/airtable/services/userService';
import type { UserFormData } from '../types/user';

export function useEditUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editUser = async (userId: string, data: UserFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await userService.updateUser(userId, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { editUser, isSubmitting, error };
}