import React from 'react';
import { Gallery } from '../components/Gallery';
import { ClientHeader } from '../components/ClientHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAirtableImages } from '../hooks/useAirtableImages';
import { useRoleCheck } from '../hooks/useRoleCheck';

export function GalleryPage() {
  const { images, loading, error } = useAirtableImages();
  const { isAdmin } = useRoleCheck();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Une erreur est survenue lors du chargement des images.</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Banque d'images
        </h1>
      </div>
      <ClientHeader />
      <Gallery 
        images={images}
        isAdmin={isAdmin()}
      />
    </div>
  );
}