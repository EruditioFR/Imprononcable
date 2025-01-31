import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, ImagePlus } from 'lucide-react';
import { useClients } from '../../../hooks/useClients';
import { processCreatifSchema, type ProcessCreatifFormData } from '../../../types/processCreatif';
import { RichTextEditor } from '../../Blog/Editor/RichTextEditor';
import { ImageSelector } from '../../Blog/ImageSelector/ImageSelector';

interface ProcessCreatifFormProps {
  initialData?: Partial<ProcessCreatifFormData>;
  onSubmit: (data: ProcessCreatifFormData) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  attachmentUrl?: string;
}

export function ProcessCreatifForm({
  initialData,
  onSubmit,
  isSubmitting,
  error,
  onClose,
  attachmentUrl
}: ProcessCreatifFormProps) {
  const { clients, loading: loadingClients } = useClients();
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    thumbnailUrl: string;
    title: string;
    tags?: string;
    file?: File;
  } | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProcessCreatifFormData>({
    resolver: zodResolver(processCreatifSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      client: initialData?.client || '',
      status: 'published',
      publishedAt: initialData?.publishedAt || new Date().toLocaleDateString('fr-FR'),
      authorId: initialData?.authorId || '',
      featuredImage: initialData?.featuredImage
    }
  });

  const content = watch('content');
  const selectedClientId = watch('client');

  // Update selectedClientName when client changes
  useEffect(() => {
    if (selectedClientId && clients.length > 0) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        setSelectedClientName(client.name);
      }
    } else {
      setSelectedClientName('');
    }
  }, [selectedClientId, clients]);

  // Pre-select client when form loads with initialData
  useEffect(() => {
    if (initialData?.client && clients.length > 0) {
      setValue('client', initialData.client);
      const client = clients.find(c => c.id === initialData.client);
      if (client) {
        setSelectedClientName(client.name);
      }
    }
  }, [initialData, clients, setValue]);

  // Pre-select image when form loads with initialData
  useEffect(() => {
    if (initialData?.featuredImage) {
      setSelectedImage({
        url: initialData.featuredImage,
        thumbnailUrl: initialData.featuredImage,
        title: initialData.title || 'Image à la une',
      });
      setValue('featuredImage', initialData.featuredImage);
    }
  }, [initialData, setValue]);

  const handleImageSelect = (imageInfo: {
    url: string;
    thumbnailUrl: string;
    title: string;
    tags?: string;
    file?: File;
  }) => {
    setSelectedImage(imageInfo);
    
    // If it's a file upload, pass the File object
    if (imageInfo.file) {
      setValue('featuredImage', imageInfo.file);
    } else {
      // If it's from media library, pass the URL
      setValue('featuredImage', imageInfo.url);
    }
  };

  const handleFormSubmit = async (data: ProcessCreatifFormData) => {
    try {
      // If we have a File object in featuredImage, create a FormData
      if (data.featuredImage instanceof File) {
        const formData = new FormData();
        formData.append('image', data.featuredImage);
        
        // The onSubmit handler in the parent component will handle the file upload
        // and update the "image à la une" attachment field
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting || loadingClients}
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option 
              key={client.id} 
              value={client.id}
            >
              {client.name}
            </option>
          ))}
        </select>
        {errors.client && (
          <p className="mt-1 text-sm text-red-600">{errors.client.message}</p>
        )}
      </div>

      <div>
        <ImageSelector
          clientId={selectedClientName}
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          disabled={isSubmitting}
        />
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
              <span>{initialData ? 'Mise à jour...' : 'Création...'}</span>
            </>
          ) : (
            <span>{initialData ? 'Mettre à jour' : 'Créer'}</span>
          )}
        </button>
      </div>
    </form>
  );
}