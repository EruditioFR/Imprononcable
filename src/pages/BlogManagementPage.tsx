import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BlogManagementTable } from '../components/Blog/Management/BlogManagementTable';

export function BlogManagementPage() {
  const navigate = useNavigate();
  const { articles, loading, error, deleteArticle } = useBlog();
  const [isDeleting, setIsDeleting] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Une erreur est survenue lors du chargement des articles.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    if (!window.confirm('Cette action est irréversible. Confirmer la suppression ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteArticle(id);
    } catch (err) {
      console.error('Failed to delete article:', err);
      alert('Une erreur est survenue lors de la suppression de l\'article');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des articles
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez les articles, créez de nouveaux contenus et modifiez les articles existants.
              </p>
            </div>
            <button
              onClick={() => navigate('/ensemble/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer un article
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <BlogManagementTable
            articles={articles}
            onEdit={(id) => navigate(`/ensemble/edit/${id}`)}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}