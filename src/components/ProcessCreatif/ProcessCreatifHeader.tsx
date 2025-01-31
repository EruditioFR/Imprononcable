import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { useRoleCheck } from '../../hooks/useRoleCheck';

export function ProcessCreatifHeader() {
  const { isAdmin } = useRoleCheck();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Ressources
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Consultez les ressources disponibles pour vos projets
          </p>
        </div>

        {isAdmin() && (
          <Link
            to="/ressources/manage"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Gérer les ressources
          </Link>
        )}
      </div>
    </div>
  );
}