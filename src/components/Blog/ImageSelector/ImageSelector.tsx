import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

interface ImageInfo {
  url: string;
  thumbnailUrl: string;
  title: string;
  tags?: string;
  file?: File; // Add file property for uploads
}

interface ImageSelectorProps {
  clientId: string | null;
  onImageSelect: (imageInfo: ImageInfo) => void;
  selectedImage: ImageInfo | null;
  disabled?: boolean;
}

export function ImageSelector({ clientId, onImageSelect, selectedImage, disabled }: ImageSelectorProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Créer une URL pour la prévisualisation
    const previewUrl = URL.createObjectURL(file);
    setUploadPreview(previewUrl);
    
    // Pass both the file and preview URL
    onImageSelect({
      url: previewUrl,
      thumbnailUrl: previewUrl,
      title: file.name,
      file // Pass the actual file for Airtable upload
    });
  };

  const handleRemoveImage = () => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }
    setUploadPreview(null);
    onImageSelect({
      url: '',
      thumbnailUrl: '',
      title: ''
    });
  };

  if (!clientId) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-500">
          Veuillez d'abord sélectionner un client pour ajouter une image
        </p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image à la une
      </label>

      {(selectedImage?.url || uploadPreview) ? (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div className="relative aspect-w-16 aspect-h-9">
            <img
              src={selectedImage?.thumbnailUrl || uploadPreview || ''}
              alt={selectedImage?.title || 'Image preview'}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              disabled={disabled}
            >
              <X size={16} />
            </button>
          </div>
          {selectedImage && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                {selectedImage.title}
              </h4>
              {selectedImage.tags && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {selectedImage.tags}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className={`flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Uploader une image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={disabled}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => setShowMediaLibrary(true)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Choisir depuis la médiathèque</p>
          </button>
        </div>
      )}

      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={onImageSelect}
        clientId={clientId}
      />
    </div>
  );
}