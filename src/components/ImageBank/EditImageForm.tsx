import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { imageBankSchema, type ImageBankFormData } from '../../types/imageBank';
import { FormField } from '../ui/FormField';
import { ImageUpload } from './AddImageForm/ImageUpload';
import { CategorySelect } from './AddImageForm/CategorySelect';
import { TagSelect } from './AddImageForm/TagSelect';
import { UserSelect } from './AddImageForm/UserSelect';

interface EditImageFormProps {
  image: ImageBankFormData;
  onSubmit: (data: ImageBankFormData) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function EditImageForm({ image, onSubmit, isSubmitting, error }: EditImageFormProps) {
  const { clients } = useClients();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ImageBankFormData>({
    resolver: zodResolver(imageBankSchema),
    defaultValues: {
      title: image.title,
      client: image.client,
      categories: image.categories,
      tags: image.tags,
      authorizedUsers: image.authorizedUsers
    }
  });

  const handleImageUpload = (file: File) => {
    setValue('file', file);
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Image"
        error={errors.file?.message}
      >
        <ImageUpload
          onUpload={handleImageUpload}
          disabled={isSubmitting}
          currentImage={image.url}
        />
      </FormField>

      <FormField
        label="Client"
        error={errors.client?.message}
      >
        <select
          {...register('client')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting}
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Catégories"
        error={errors.categories?.message}
      >
        <CategorySelect
          value={watch('categories') || []}
          onChange={(categories) => setValue('categories', categories)}
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Tags"
        error={errors.tags?.message}
      >
        <TagSelect
          value={watch('tags') || []}
          onChange={(tags) => setValue('tags', tags)}
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Utilisateurs autorisés"
        error={errors.authorizedUsers?.message}
      >
        <UserSelect
          value={watch('authorizedUsers') || []}
          onChange={(users) => setValue('authorizedUsers', users)}
          disabled={isSubmitting}
        />
      </FormField>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
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