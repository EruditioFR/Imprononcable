import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Plus } from 'lucide-react';
import { BlogGrid } from '../components/Blog/BlogGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBlog } from '../hooks/useBlog';
import { useRoleCheck } from '../hooks/useRoleCheck';

export function BlogPage() {
  const { isAdmin } = useRoleCheck();
  // Toujours passer publishedOnly=true pour la page publique
  const { articles, loading, error } = useBlog(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <Newspaper className="h-8 w-8 text-primary-500" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Ensemble
                </h1>
              </div>
              <p className="mt-2 text-gray-600">
                Découvrez nos derniers articles et actualités
              </p>
            </div>
            
            {isAdmin() && (
              <div className="flex gap-3">
                <Link
                  to="/ensemble/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Créer un article
                </Link>
                <Link
                  to="/ensemble/manage"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Gérer les articles
                </Link>
              </div>
            )}
          </div>
        </div>

        <BlogGrid posts={articles} />
      </div>
    </div>
  );
}