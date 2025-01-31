import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { BlogEditor } from '../components/Blog/BlogEditor';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../contexts/AuthContext';
import type { BlogFormData } from '../types/blog';

export function CreateBlogPage() {
  const navigate = useNavigate();
  const { createArticle } = useBlog();
  const { user } = useAuth();

  const handleSubmit = async (data: BlogFormData) => {
    try {
      if (!user?.id) {
        throw new Error('Vous devez être connecté pour créer un article');
      }

      // Ajouter l'ID de l'auteur aux données du formulaire
      const formData = {
        ...data,
        authorId: user.id
      };

      await createArticle(formData);
      navigate('/ensemble/manage');
    } catch (err) {
      console.error('Failed to create article:', err);
      alert('Une erreur est survenue lors de la création de l\'article');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Créer un article
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Créez un nouvel article pour le blog
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <BlogEditor onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}