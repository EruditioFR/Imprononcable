import { useState } from 'react';
import { imageBankService } from '../services/airtable/services/imageBankService';
import type { ImageBankFormData } from '../types/imageBank';

export function useEditImage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editImage = async (id: string, data: ImageBankFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await imageBankService.updateImage(id, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editImage,
    isSubmitting,
    error
  };
}