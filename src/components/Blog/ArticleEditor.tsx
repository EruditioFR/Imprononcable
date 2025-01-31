import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { createBlogSchema, type BlogFormData } from '../../types/blog';
import { RichTextEditor } from './Editor/RichTextEditor';

interface ArticleEditorProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ArticleEditor({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}: ArticleEditorProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      status: initialData?.status || 'draft',
      publishedAt: initialData?.publishedAt || new Date().toISOString().split('T')[0]
    }
  });

  const content = watch('content');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <div className="grid grid-cols-2 gap-4">
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Enregistrement...</span>
            </>
          ) : (
            <span>Enregistrer</span>
          )}
        </button>
      </div>
    </form>
  );
}