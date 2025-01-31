import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { blogSchema, type BlogPost, type BlogFormData } from '../../types/blog';
import { RichTextEditor } from './Editor/RichTextEditor';
import { ImageSelector } from './ImageSelector/ImageSelector';
import { dropboxService } from '../../services/dropbox/dropboxService';

interface BlogEditorProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogFormData) => Promise<void>;
}

export function BlogEditor({ initialData, onSubmit }: BlogEditorProps) {
  const { clients, loading: loadingClients } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    thumbnailUrl: string;
    title: string;
    tags?: string;
    file?: File;
  } | null>(null);

  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      category: initialData?.category || '',
      status: initialData?.status || 'draft',
      publishedAt: initialData?.publishedAt.split('T')[0] || new Date().toISOString().split('T')[0],
      client: initialData?.clientId || '',
      authorId: initialData?.authorId || '',
      image: initialData?.mediaLibraryUrl || initialData?.uploadedImage || undefined
    }
  });

  const content = watch('content');
  const selectedClientId = watch('client');

  useEffect(() => {
    if (initialData) {
      const mediaLibraryUrl = initialData.mediaLibraryUrl;
      const uploadedImage = initialData.uploadedImage;
      const imageUrl = mediaLibraryUrl || uploadedImage || null;
      
      if (imageUrl) {
        setSelectedImage({
          url: imageUrl,
          thumbnailUrl: imageUrl,
          title: initialData.title
        });
      }
    }
  }, [initialData]);

  const handleImageSelect = async (imageInfo: {
    url: string;
    thumbnailUrl: string;
    title: string;
    tags?: string;
    file?: File;
  }) => {
    try {
      if (imageInfo.file) {
        // Upload to Dropbox if it's a file upload
        const dropboxUrl = await dropboxService.uploadFile(
          imageInfo.file,
          'blog-images'
        );
        
        setSelectedImage({
          ...imageInfo,
          url: dropboxUrl,
          thumbnailUrl: dropboxUrl
        });
        setValue('image', dropboxUrl);
      } else {
        // Use the URL directly if it's from media library
        setSelectedImage(imageInfo);
        setValue('image', imageInfo.url);
      }
    } catch (err) {
      console.error('Failed to handle image:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const handleFormSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        ...data,
        image: selectedImage?.url
      });
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
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
        <Controller
          name="client"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={isSubmitting || loadingClients}
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.client && (
          <p className="mt-1 text-sm text-red-600">{errors.client.message}</p>
        )}
      </div>

      <ImageSelector
        clientId={selectedClientId}
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage}
        disabled={isSubmitting}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Extrait
        </label>
        <textarea
          {...register('excerpt')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Un bref résumé de l'article..."
          disabled={isSubmitting}
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={isSubmitting}
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="Actualités">Actualités</option>
          <option value="Projets">Projets</option>
          <option value="Conseils">Conseils</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={isSubmitting}
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de publication
          </label>
          <input
            type="date"
            {...register('publishedAt')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <input type="hidden" {...register('authorId')} />

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
              <span>{initialData ? 'Mise à jour...' : 'Création...'}</span>
            </>
          ) : (
            <span>{initialData ? 'Mettre à jour' : 'Créer l\'article'}</span>
          )}
        </button>
      </div>
    </form>
  );
}