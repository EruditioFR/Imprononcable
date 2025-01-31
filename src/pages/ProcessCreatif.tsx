import React from 'react';
import { Link } from 'react-router-dom';
import { ProcessCreatifList } from '../components/ProcessCreatif/ProcessCreatifList';
import { ProcessCreatifHeader } from '../components/ProcessCreatif/ProcessCreatifHeader';
import { useProcessCreatif } from '../hooks/useProcessCreatif';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus } from 'lucide-react';
import { useRoleCheck } from '../hooks/useRoleCheck';

export function ProcessCreatif() {
  const { processes, loading, error } = useProcessCreatif();
  const { isAdmin } = useRoleCheck();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Ressources
                </h1>
              </div>
              <p className="mt-2 text-gray-600">
                Consultez les ressources disponibles pour vos projets
              </p>
            </div>

            {isAdmin() && (
              <div className="flex gap-3">
                <Link
                  to="/ressources/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Créer une ressource
                </Link>
                <Link
                  to="/ressources/manage"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Gérer les ressources
                </Link>
              </div>
            )}
          </div>
        </div>
        <ProcessCreatifList processes={processes} />
      </div>
    </div>
  );
}