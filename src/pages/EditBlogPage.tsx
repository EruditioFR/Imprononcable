import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { BlogEditor } from '../components/Blog/BlogEditor';
import { useBlog } from '../hooks/useBlog';
import { useBlogPost } from '../hooks/useBlogPost';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { BlogFormData } from '../types/blog';

export function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateArticle } = useBlog();
  const { post, loading, error } = useBlogPost(id!);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !post) {
    return (
      <div className="text-center text-red-600">
        <p>Une erreur est survenue lors du chargement de l'article.</p>
        <p className="text-sm mt-2">{error?.message || 'Article non trouvé'}</p>
      </div>
    );
  }

  const handleSubmit = async (data: BlogFormData) => {
    try {
      await updateArticle(id!, data);
      navigate('/ensemble/manage');
    } catch (err) {
      console.error('Failed to update article:', err);
      alert('Une erreur est survenue lors de la mise à jour de l\'article');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier l'article
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de l'article
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <BlogEditor 
            initialData={post}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}