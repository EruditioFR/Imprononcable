import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { creaPhotoService } from '../services/airtable/services/creaPhotoService';
import type { BriefFormData } from '../types/brief';

export function useCreateBrief() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrief = async (data: BriefFormData) => {
    if (!user) {
      throw new Error('You must be logged in to create a brief');
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await creaPhotoService.createBrief({
        ...data,
        authorId: user.id
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create brief');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createBrief, isSubmitting, error };
}