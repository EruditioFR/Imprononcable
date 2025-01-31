import React, { useState } from 'react';
import { useBlog } from '../hooks/useBlog';
import { useRoleCheck } from '../hooks/useRoleCheck';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertTriangle } from 'lucide-react';
import { ArticleEditor } from '../components/Blog/ArticleEditor';
import { ArticleList } from '../components/Blog/ArticleList';
import type { Article } from '../types/blog';

export function LaCreaPoto() {
  const { isAdmin } = useRoleCheck();
  const { articles, loading, error, createArticle, updateArticle, deleteArticle } = useBlog();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas accès à cette page
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Impossible de charger le contenu
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (editingArticle) {
        await updateArticle(editingArticle.id, data);
      } else {
        await createArticle(data);
      }
      setEditingArticle(null);
    } catch (err) {
      console.error('Failed to save article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticle(id);
      } catch (err) {
        console.error('Failed to delete article:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          La Créa Photo (admin)
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <ArticleEditor
            initialData={editingArticle || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Articles
          </h2>
          <ArticleList
            articles={articles}
            onEdit={setEditingArticle}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}