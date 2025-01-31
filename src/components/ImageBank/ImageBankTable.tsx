import React, { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { ImageThumbnail } from './ImageThumbnail';
import { ImagePreviewModal } from './ImagePreviewModal';
import type { Image } from '../../types/gallery';
import { imageBankService } from '../../services/airtable/services/imageBankService';

interface ImageBankTableProps {
  images: Image[];
  onDelete: (imageId: string) => void;
  isDeleting: boolean;
}

export function ImageBankTable({ images, onDelete, isDeleting }: ImageBankTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTags, setEditingTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const handleDelete = (imageId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      onDelete(imageId);
    }
  };

  const startEditing = (image: Image) => {
    setEditingId(image.id);
    setEditingTags(image['tags proposés'] || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTags('');
  };

  const saveTags = async (imageId: string) => {
    try {
      setIsSaving(true);
      await imageBankService.updateTags(imageId, editingTags);
      setEditingId(null);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Failed to update tags:', error);
      alert('Une erreur est survenue lors de la mise à jour des mots-clés');
    } finally {
      setIsSaving(false);
    }
  };

  const openPreview = (image: Image) => {
    setPreviewImage({
      url: image.thumbnailUrl,
      title: image.title
    });
  };

  if (!Array.isArray(images) || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune image n'a été ajoutée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre / Projet
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Format
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mots-clés
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {images.map((image) => (
            <tr key={image.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div 
                  onClick={() => openPreview(image)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <ImageThumbnail src={image.thumbnailUrl || image.url} alt={image.title} />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {image.title}
                  </div>
                  {image.Projet && (
                    <div className="text-xs text-gray-500 mt-1">
                      {image.Projet}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    <button
                      onClick={() => openPreview(image)}
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Voir l'image
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {image.Format || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                {editingId === image.id ? (
                  <div className="flex items-start gap-2">
                    <textarea
                      value={editingTags}
                      onChange={(e) => setEditingTags(e.target.value)}
                      className="w-full min-h-[100px] text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Entrez les mots-clés..."
                      disabled={isSaving}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => saveTags(image.id)}
                        disabled={isSaving}
                        className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                        title="Enregistrer"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={isSaving}
                        className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                        title="Annuler"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    <div 
                      className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 pr-8"
                      onClick={() => startEditing(image)}
                    >
                      {image['tags proposés'] || 'Cliquez pour ajouter des mots-clés'}
                    </div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-900"
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage?.url || ''}
        imageTitle={previewImage?.title || ''}
      />
    </div>
  );
}