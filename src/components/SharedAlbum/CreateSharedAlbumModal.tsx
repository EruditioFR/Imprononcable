import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader, AlertTriangle } from 'lucide-react';
import { createSharedAlbumSchema, type CreateSharedAlbumData } from '../../types/sharedAlbum';
import { sharedAlbumService } from '../../services/airtable/services/sharedAlbumService';
import { useAuth } from '../../contexts/AuthContext';

interface CreateSharedAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: string[];
}

export function CreateSharedAlbumModal({ 
  isOpen, 
  onClose,
  selectedImages 
}: CreateSharedAlbumModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [recipientsText, setRecipientsText] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateSharedAlbumData>({
    resolver: zodResolver(createSharedAlbumSchema),
    defaultValues: {
      imageIds: selectedImages,
      recipients: []
    }
  });

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRecipientsText(text);
    
    // Convert text to array of emails
    const emails = text
      .split(/[\n,]/) // Split by newline or comma
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    setValue('recipients', emails);
  };

  const onSubmit = async (data: CreateSharedAlbumData) => {
    if (!user) {
      setError('Vous devez être connecté pour créer un album partagé');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setEmailErrors([]);

      const result = await sharedAlbumService.createSharedAlbum(data, user.id);
      
      // Si des erreurs d'envoi d'email sont survenues
      if (result.emailErrors?.length) {
        setEmailErrors(result.emailErrors);
        // On ne ferme pas le modal pour que l'utilisateur puisse voir les erreurs
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Créer un album partagé
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'album
              </label>
              <input
                type="text"
                {...register('title')}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                placeholder="Mon album photo"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                placeholder="Ajoutez un message pour les destinataires..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emails des destinataires
              </label>
              <textarea
                value={recipientsText}
                onChange={handleRecipientsChange}
                rows={3}
                placeholder="john@example.com, jane@example.com"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                disabled={isSubmitting}
              />
              {errors.recipients && (
                <p className="mt-2 text-sm text-red-600">{errors.recipients.message}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Séparez les adresses par des virgules ou des retours à la ligne
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration
              </label>
              <input
                type="date"
                {...register('expiresAt')}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                disabled={isSubmitting}
              />
              {errors.expiresAt && (
                <p className="mt-2 text-sm text-red-600">{errors.expiresAt.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {emailErrors.length > 0 && (
              <div className="rounded-lg bg-yellow-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">
                    L'album a été créé mais certains emails n'ont pas pu être envoyés
                  </p>
                </div>
                <ul className="ml-6 mt-2 text-sm text-yellow-700 list-disc">
                  {emailErrors.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-yellow-700">
                  Vous pouvez partager le lien et le mot de passe manuellement avec ces destinataires.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Création...</span>
                  </>
                ) : (
                  <span>Créer l'album</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}