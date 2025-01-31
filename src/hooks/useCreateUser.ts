import { useState } from 'react';
import { userCreationService } from '../services/airtable/services/userCreationService';
import type { UserFormData } from '../types/user';

export function useCreateUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createUser = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      await userCreationService.createUser(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createUser,
    isSubmitting,
    error,
    success
  };
}