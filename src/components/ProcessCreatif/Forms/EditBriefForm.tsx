import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useEditBrief } from '../../../hooks/useEditBrief';
import { useClients } from '../../../hooks/useClients';
import { briefSchema, type BriefFormData, type Brief } from '../../../types/brief';
import { FormField } from './FormField';
import { RichTextEditor } from '../../Blog/Editor/RichTextEditor';

interface EditBriefFormProps {
  brief: Brief;
  onClose: () => void;
}

export function EditBriefForm({ brief, onClose }: EditBriefFormProps) {
  const { clients, loading: loadingClients } = useClients();
  const { updateBrief, isSubmitting, error } = useEditBrief();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BriefFormData>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      title: brief.title,
      content: brief.content,
      client: brief.client,
      status: brief.status
    }
  });

  const content = watch('content');

  const onSubmit = async (data: BriefFormData) => {
    try {
      await updateBrief(brief.id, data);
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Titre"
        error={errors.title?.message}
      >
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Client"
        error={errors.client?.message}
      >
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
      </FormField>

      <FormField
        label="Contenu"
        error={errors.content?.message}
      >
        <RichTextEditor
          content={content}
          onChange={(newContent) => setValue('content', newContent, { shouldValidate: true })}
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Statut"
        error={errors.status?.message}
      >
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </FormField>

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
              <span>Mise à jour en cours...</span>
            </>
          ) : (
            <span>Mettre à jour</span>
          )}
        </button>
      </div>
    </form>
  );
}