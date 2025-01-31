import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { processCreatifService } from '../services/airtable/services/processCreatifService';
import type { ProcessCreatifFormData } from '../types/processCreatif';

export function useCreateProcessCreatif() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProcess = async (data: ProcessCreatifFormData) => {
    if (!user) {
      throw new Error('You must be logged in to create a resource');
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await processCreatifService.createProcess({
        ...data,
        authorId: user.id
      });
      
    } catch (err) {
      console.error('Failed to create resource:', err);
      setError(err instanceof Error ? err.message : 'Failed to create resource');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createProcess, isSubmitting, error };
}