import React from 'react';
import { format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil, Trash2, FileText } from 'lucide-react';
import type { ProcessCreatif } from '../../../types/processCreatif';

interface ProcessCreatifManagementTableProps {
  processes: ProcessCreatif[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ProcessCreatifManagementTable({ 
  processes, 
  onEdit, 
  onDelete,
  isDeleting 
}: ProcessCreatifManagementTableProps) {
  // Fonction pour formater la date en toute sécurité
  const formatDate = (dateStr: string) => {
    try {
      // Essayer d'abord le format français (dd/MM/yyyy)
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy', { locale: fr });
      }

      // Si ça ne marche pas, essayer comme date ISO
      const date = new Date(dateStr);
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy', { locale: fr });
      }

      // Si aucun format ne fonctionne, retourner la date telle quelle
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  if (processes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Aucune ressource
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Commencez par créer votre première ressource en utilisant le bouton "Créer une ressource" ci-dessus.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Auteur
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date de publication
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {process.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {process.client}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {process.author}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(process.publishedAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(process.id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(process.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}