import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { creaPhotoService } from '../services/airtable/services/creaPhotoService';
import type { BriefFormData } from '../types/brief';

export function useEditBrief() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBrief = async (id: string, data: BriefFormData) => {
    if (!user) {
      throw new Error('You must be logged in to update a brief');
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await creaPhotoService.updateBrief(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update brief');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateBrief, isSubmitting, error };
}