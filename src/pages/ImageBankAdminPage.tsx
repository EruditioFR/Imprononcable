import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { useImageBank } from '../hooks/useImageBank';
import { ImageBankTable } from '../components/ImageBank/ImageBankTable';
import { ImageBankFilters } from '../components/ImageBank/Filters/ImageBankFilters';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function ImageBankAdminPage() {
  const { images, loading, error, deleteImage } = useImageBank();
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredImages = useMemo(() => {
    if (!images) return [];

    return images.filter(image => {
      // Search filter
      const searchTerms = searchQuery.toLowerCase().split(' ');
      const searchMatch = searchTerms.every(term => {
        const searchFields = [
          image.title,
          image.Projet,
          image['tags proposés']
        ].filter(Boolean).join(' ').toLowerCase();
        return searchFields.includes(term);
      });
      if (!searchMatch) return false;

      // Format filter
      if (selectedFormat && image.Format !== selectedFormat) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const imageTags = (image['tags proposés'] || '').toLowerCase();
        const match = selectedTags.every(tag =>
          imageTags.includes(tag.toLowerCase())
        );
        if (!match) return false;
      }

      return true;
    });
  }, [images, searchQuery, selectedFormat, selectedTags]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteImage(id);
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Une erreur est survenue lors de la suppression de l\'image');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-primary-500" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion de la banque d'images
                </h1>
              </div>
              <p className="mt-2 text-gray-600">
                Gérez les images, ajoutez de nouvelles images et modifiez les informations existantes.
              </p>
            </div>
            <Link
              to="/banque-images/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une image
            </Link>
          </div>
        </div>

        <ImageBankFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        <div className="bg-white rounded-lg shadow">
          <ImageBankTable
            images={filteredImages}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}