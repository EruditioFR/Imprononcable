import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Album, Eye, Lock, Calendar, Pencil, Trash2, Mail, FolderOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sharedAlbumService } from '../services/airtable/services/sharedAlbumService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatFrenchDate } from '../utils/dates';
import type { SharedAlbum } from '../types/sharedAlbum';

export function SharedAlbumsManagementPage() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<SharedAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<SharedAlbum | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      if (!user?.id) {
        setError('Vous devez être connecté pour accéder à cette page');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const userAlbums = await sharedAlbumService.getUserAlbums(user.id);
        setAlbums(userAlbums);
      } catch (err) {
        console.error('Failed to fetch albums:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Une erreur est survenue lors du chargement des albums'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, [user?.id]); // Changed dependency to user.id

  const handleDelete = async (albumId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
      return;
    }

    try {
      await sharedAlbumService.deleteAlbum(albumId);
      setAlbums(albums.filter(album => album.id !== albumId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la suppression');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Vous devez être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Album className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des albums partagés
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Gérez les albums que vous avez partagés avec d'autres utilisateurs
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {albums.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Aucun album partagé
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Vous n'avez pas encore créé d'albums partagés. Vous pouvez en créer un en sélectionnant des images dans la banque d'images.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateurs invités
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mot de passe
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'expiration
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
                  {albums.map((album) => (
                    <tr key={album.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {album.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {album.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {album.recipients.map((recipient) => (
                            <div key={recipient.email} className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{recipient.email}</span>
                              <span className="text-xs text-gray-400">
                                ({recipient.accessCount} visites)
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {album.password}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatFrenchDate(album.expiresAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          album.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {album.status === 'active' ? 'Actif' : 'Expiré'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/shared-albums/${album.id}`}
                            className="text-gray-400 hover:text-gray-500"
                            title="Voir l'album"
                            target="_blank"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => setEditingAlbum(album)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(album.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
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
          )}
        </div>
      </div>
    </div>
  );
}