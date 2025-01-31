import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { useImageBank } from '../hooks/useImageBank';
import { ImageBankFilter } from '../components/ImageBank/ImageBankFilter';
import { ImageBankTable } from '../components/ImageBank/ImageBankTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function ImageBankPage() {
  const { images, loading, error, deleteImage } = useImageBank();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);

  // N'activer les filtres qu'une fois les images chargées
  useEffect(() => {
    if (!loading && images.length > 0) {
      setIsFilterEnabled(true);
    }
  }, [loading, images]);

  const filteredImages = images.filter(image => {
    if (!isFilterEnabled) return true;

    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.every(cat => image.categories.includes(cat));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => image.tags.includes(tag));
    
    const matchesClient = !selectedClient || image.client === selectedClient;

    return matchesCategories && matchesTags && matchesClient;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-primary-500" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des banques d'images
                </h1>
              </div>
              <p className="mt-2 text-gray-600">
                Gérez votre bibliothèque d'images et les droits d'utilisation associés. Vous pouvez filtrer les images par catégorie, tag ou client, et modifier leurs informations.
              </p>
            </div>
            <Link
              to="/images/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une image
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {isFilterEnabled && (
              <ImageBankFilter
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                selectedTags={selectedTags}
                onTagChange={setSelectedTags}
                selectedClient={selectedClient}
                onClientChange={setSelectedClient}
              />
            )}
            
            <ImageBankTable
              images={filteredImages}
              onDelete={deleteImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}