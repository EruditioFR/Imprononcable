import { useState } from 'react';
import type { RightsRequestFormData } from '../../../types/rightsRequest';
import type { Image } from '../../../types/gallery';
import { emailService } from '../../../services/email/emailService';
import { useAuth } from '../../../contexts/AuthContext';

export function useRightsRequest(image: Image, onSuccess: () => void) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: RightsRequestFormData) => {
    if (!user) {
      setError('Vous devez être connecté pour effectuer cette action.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await emailService.sendRightsRequest(
        image, 
        data,
        user.prenom || 'Utilisateur',
        user.email
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi de la demande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    success,
    error,
    handleSubmit
  };
}