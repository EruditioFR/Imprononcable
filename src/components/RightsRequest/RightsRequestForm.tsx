import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { rightsRequestSchema, type RightsRequestFormData } from '../../types/rightsRequest';
import type { Image } from '../../types/gallery';
import { formatFrenchDate } from '../../utils/dates';

interface RightsRequestFormProps {
  image: Image;
  onSubmit: (data: RightsRequestFormData) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  onClose: () => void;
}

export function RightsRequestForm({
  image,
  onSubmit,
  isSubmitting,
  error,
  success,
  onClose
}: RightsRequestFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RightsRequestFormData>({
    resolver: zodResolver(rightsRequestSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-6">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <img
            src={image.url}
            alt={image.title}
            className="object-cover rounded-lg"
          />
        </div>
        <h3 className="font-medium text-gray-900">{image.title}</h3>
        {image.rights.endDate && (
          <p className="text-sm text-gray-500">
            Droits échus le {formatFrenchDate(image.rights.endDate)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            type="date"
            {...register('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            disabled={isSubmitting}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <input
            type="date"
            {...register('endDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            disabled={isSubmitting}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Motif de la demande
        </label>
        <textarea
          {...register('reason')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Veuillez expliquer pourquoi vous souhaitez prolonger les droits..."
          disabled={isSubmitting}
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Votre demande a été envoyée avec succès
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader size={20} className="animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <span>Envoyer la demande</span>
          )}
        </button>
      </div>
    </form>
  );
}