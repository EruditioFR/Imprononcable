import { useState } from 'react';
import { imageBankService } from '../services/airtable/services/imageBankService';
import type { ImageBankFormData } from '../types/imageBank';

export function useAddImage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImage = async (data: ImageBankFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await imageBankService.createImage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d\'ajouter l\'image');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addImage,
    isSubmitting,
    error
  };
}