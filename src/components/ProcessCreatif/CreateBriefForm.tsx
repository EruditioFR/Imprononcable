import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useCreateBrief } from '../../hooks/useCreateBrief';
import { useClients } from '../../hooks/useClients';
import { briefSchema, type BriefFormData } from '../../types/brief';
import { RichTextEditor } from '../Blog/Editor/RichTextEditor';

interface CreateBriefFormProps {
  onClose: () => void;
}

export function CreateBriefForm({ onClose }: CreateBriefFormProps) {
  const { clients, loading: loadingClients } = useClients();
  const { createBrief, isSubmitting, error } = useCreateBrief();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BriefFormData>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      title: '',
      content: '',
      client: '',
      status: 'draft'
    }
  });

  const content = watch('content');

  const onSubmit = async (data: BriefFormData) => {
    try {
      await createBrief(data);
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client
        </label>
        <select
          {...register('client')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting || loadingClients}
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
        {errors.client && (
          <p className="mt-1 text-sm text-red-600">{errors.client.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu
        </label>
        <RichTextEditor
          content={content}
          onChange={(newContent) => setValue('content', newContent, { shouldValidate: true })}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
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
              <Loader className="animate-spin" size={20} />
              <span>Création en cours...</span>
            </>
          ) : (
            <span>Créer le brief</span>
          )}
        </button>
      </div>
    </form>
  );
}