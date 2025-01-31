import React, { useState } from 'react';
import { X, Search, Loader, Tag } from 'lucide-react';
import { useImageBank } from '../../../hooks/useImageBank';
import { Image } from '../../../types/gallery';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageInfo: {
    url: string;
    thumbnailUrl: string;
    title: string;
    tags?: string;
  }) => void;
  clientId: string;
}

// Make sure to export the component properly
export default function MediaLibraryModal({ isOpen, onClose, onSelect, clientId }: MediaLibraryModalProps) {
  const { images, loading, error } = useImageBank(clientId);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les images en fonction de la recherche
  const filteredImages = images.filter(img => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      img.title.toLowerCase().includes(query) ||
      img.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (img['tags proposés'] && img['tags proposés'].toLowerCase().includes(query))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Médiathèque
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Images disponibles pour {clientId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une image..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin h-8 w-8 text-primary-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              Une erreur est survenue lors du chargement des images
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {searchQuery 
                ? "Aucune image ne correspond à votre recherche"
                : "Aucune image disponible pour ce client"
              }
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => onSelect({
                    url: image.url,
                    thumbnailUrl: image.thumbnailUrl,
                    title: image.title,
                    tags: image['tags proposés']
                  })}
                  className="relative group rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-sm font-medium mb-2">
                          Sélectionner
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/75">
                    <h4 className="text-white text-sm font-medium truncate mb-1">
                      {image.title}
                    </h4>
                    {image['tags proposés'] && (
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <Tag size={12} />
                        <span className="truncate">{image['tags proposés']}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}