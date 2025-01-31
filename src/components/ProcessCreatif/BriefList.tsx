import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBriefs } from '../../hooks/useBriefs';
import { LoadingSpinner } from '../LoadingSpinner';
import { BriefActions } from './BriefActions';

export function BriefList() {
  const { briefs, loading, error, deleteBrief } = useBriefs();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Une erreur est survenue lors du chargement des briefs.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
              Titre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
              Auteur
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
              Date de publication
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {briefs.map((brief) => (
            <tr key={brief.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-0">
                <div className="truncate">{brief.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {brief.author}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {brief.client}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {brief.publishedAt ? format(new Date(brief.publishedAt), 'dd/MM/yyyy', { locale: fr }) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  brief.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {brief.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <BriefActions brief={brief} onDelete={deleteBrief} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}