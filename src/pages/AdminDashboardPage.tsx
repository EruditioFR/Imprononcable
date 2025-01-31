import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Image as ImageIcon, 
  FileText, 
  Newspaper,
  Users,
  Plus
} from 'lucide-react';
import { useRoleCheck } from '../hooks/useRoleCheck';
import { useLatestActivity } from '../hooks/useLatestActivity';
import { LatestActivity } from '../components/Admin/LatestActivity';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function AdminDashboardPage() {
  const { isAdmin } = useRoleCheck();
  const [currentPage, setCurrentPage] = useState(1);
  const { activities, loading, error, pagination } = useLatestActivity(currentPage);

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas les droits nécessaires pour accéder à cette page
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'Banque d\'images',
      icon: ImageIcon,
      description: 'Gérez les images, ajoutez de nouvelles images et modifiez les informations existantes.',
      links: [
        { to: '/banque-images/admin', label: 'Gérer les images' },
        { to: '/banque-images/add', label: 'Ajouter une image', primary: true }
      ]
    },
    {
      title: 'Ressources',
      icon: FileText,
      description: 'Gérez les ressources, créez de nouveaux contenus et modifiez les ressources existantes.',
      links: [
        { to: '/ressources/manage', label: 'Gérer les ressources' },
        { to: '/ressources/add', label: 'Ajouter une ressource', primary: true }
      ]
    },
    {
      title: 'Ensemble',
      icon: Newspaper,
      description: 'Gérez les articles, créez de nouveaux contenus et modifiez les articles existants.',
      links: [
        { to: '/ensemble/manage', label: 'Gérer les articles' },
        { to: '/ensemble/create', label: 'Créer un article', primary: true }
      ]
    },
    {
      title: 'Utilisateurs',
      icon: Users,
      description: 'Gérez les utilisateurs et leurs droits d\'accès.',
      links: [
        { to: '/users', label: 'Gérer les utilisateurs' },
        { to: '/users/create', label: 'Créer un utilisateur', primary: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Administration
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Gérez l'ensemble des contenus et fonctionnalités de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sections.map((section) => (
            <div 
              key={section.title}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <section.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {section.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {section.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                          link.primary
                            ? 'border-transparent text-white bg-primary-600 hover:bg-primary-700'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {link.primary && <Plus className="h-5 w-5 mr-2" />}
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">
              Une erreur est survenue lors du chargement des dernières modifications
            </p>
          </div>
        ) : (
          <LatestActivity 
            activities={activities}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}