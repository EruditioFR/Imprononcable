import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { Image } from '../types/gallery';
import { ImageCard } from './ImageCard/ImageCard';
import { FilterBar } from './FilterBar/FilterBar';
import { SelectionToolbar } from './SelectionToolbar';
import { Pagination } from './Pagination';
import { useImageSearch } from '../hooks/useImageSearch';
import { useRightsFiltering } from '../hooks/useRightsFiltering';
import { useClients } from '../hooks/useClients';
import { useAuth } from '../contexts/AuthContext';

interface GalleryProps {
  images: Image[];
  isAdmin: boolean;
}

const IMAGES_PER_PAGE = 30;

export const Gallery: React.FC<GalleryProps> = ({ images, isAdmin }) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRights, setActiveRights] = useState<'all' | 'active' | 'expired'>('all');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const { clients } = useClients();

  // If user has only one client, preselect it
  useEffect(() => {
    if (user && !isAdmin && clients.length === 1) {
      setSelectedClient(clients[0].id);
    }
  }, [user, isAdmin, clients]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClient, activeRights, selectedFormat, searchQuery]);

  // Reset selected images when client changes
  useEffect(() => {
    setSelectedImages(new Set());
  }, [selectedClient]);

  const searchResults = useImageSearch(images, searchQuery);

  // First apply client filter
  const clientFilteredImages = selectedClient
    ? searchResults.filter(image => image.client === selectedClient)
    : searchResults;

  // Then apply rights filtering to client-filtered images
  const { filteredImages: rightsFilteredImages, expiredCount, activeCount } = 
    useRightsFiltering(clientFilteredImages, activeRights);

  // Get selected client name for display
  const selectedClientName = selectedClient 
    ? clients.find(c => c.id === selectedClient)?.name 
    : '';

  // Finally apply format filter
  const filteredImages = selectedFormat
    ? rightsFilteredImages.filter(image => image.Format === selectedFormat)
    : rightsFilteredImages;

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const breakpointColumns = {
    default: 6,
    2100: 5,
    1800: 4,
    1400: 3,
    1000: 2,
    500: 1,
  };

  function convertDropboxUrl(url: string): string {
    return url.replace(/\?dl=0$/, '?raw=1')
             .replace(/&dl=0$/, '&raw=1');
  }

  function getImageFormat(url: string): string {
    const urlBeforeParams = url.split('?')[0];
    return urlBeforeParams.slice(-3).toUpperCase();
  }

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId);
    setCurrentPage(1); // Reset to first page
    setSelectedImages(new Set()); // Clear selections
  };

  const handleImageSelect = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image || image.rights.isExpired) return;

    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const activeImages = filteredImages.filter(img => !img.rights.isExpired);
    setSelectedImages(new Set(activeImages.map(img => img.id)));
  };

  const handleDeselectAll = () => {
    setSelectedImages(new Set());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLightboxImages = filteredImages.filter(img => !img.rights.isExpired);

  return (
    <div className="w-full">
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeRights={activeRights}
        onRightsChange={setActiveRights}
        expiredCount={expiredCount}
        activeCount={activeCount}
        selectedFormat={selectedFormat}
        onFormatSelect={setSelectedFormat}
        selectedClient={selectedClient}
        onClientChange={handleClientChange}
        clients={clients}
      />
      
      {/* Title section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedClientName || 'Vos images'}
        </h2>
        {filteredImages.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {filteredImages.length} image{filteredImages.length > 1 ? 's' : ''} disponible{filteredImages.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {selectedImages.size > 0 && activeRights !== 'expired' && (
        <SelectionToolbar
          selectedCount={selectedImages.size}
          totalCount={filteredImages.filter(img => !img.rights.isExpired).length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          selectedImages={filteredImages.filter(img => selectedImages.has(img.id) && !img.rights.isExpired)}
        />
      )}

      {filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            Aucune image ne correspond aux critères sélectionnés
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {currentImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={() => !image.rights.isExpired && setSelectedImage(activeLightboxImages.findIndex(img => img.id === image.id))}
              onSelect={() => handleImageSelect(image.id)}
              isSelected={selectedImages.has(image.id)}
              isAdmin={isAdmin}
            />
          ))}
        </Masonry>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Lightbox
        open={selectedImage !== null}
        index={selectedImage || 0}
        close={() => setSelectedImage(null)}
        slides={activeLightboxImages.map((image) => ({
          src: convertDropboxUrl(image.thumbnailUrl),
          title: image.title,
          filename: image.title,
          suggestedTags: image['tags proposés'] || '',
          originalUrl: image.url,
          width: image.width,
          height: image.height
        }))}
        render={{
          slide: ({ slide }) => (
            <div className="relative w-full h-full">
              <img src={slide.src} alt={slide.title} className="w-full h-full object-contain" />
              <div className="absolute bottom-4 right-4 bg-black/75 text-white p-4 rounded-lg max-w-md">
                <h3 className="text-lg font-medium">{slide.filename}</h3>
                <div className="text-xs text-white/80 mb-2 space-y-1">
                  <p>Format : {getImageFormat(slide.originalUrl)}</p>
                  <p>Dimensions : {slide.width} × {slide.height} px</p>
                </div>
                {slide.suggestedTags && (
                  <div className="text-sm text-white/90 pt-2 border-t border-white/20">
                    <p className="break-words whitespace-pre-wrap">{slide.suggestedTags}</p>
                  </div>
                )}
              </div>
            </div>
          )
        }}
      />
    </div>
  );
};