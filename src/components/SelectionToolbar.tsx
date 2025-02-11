import React, { useState } from 'react';
import { Download, CheckSquare, Square, Loader, Share2 } from 'lucide-react';
import { Image } from '../types/gallery';
import { downloadImages } from '../utils/download';
import { CreateSharedAlbumModal } from './SharedAlbum/CreateSharedAlbumModal';

interface SelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectedImages: Image[];
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  selectedImages,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setProgress(0);
    setStatus('Préparation du téléchargement...');
    
    try {
      const processedCount = await downloadImages(selectedImages, (progress) => {
        setProgress(Math.round(progress));
        if (progress < 90) {
          setStatus(`Traitement des images (${Math.round(progress)}%)...`);
        } else {
          setStatus('Création du fichier ZIP...');
        }
      });

      setStatus(`${processedCount} image${processedCount > 1 ? 's' : ''} téléchargée${processedCount > 1 ? 's' : ''} avec succès`);
    } catch (error) {
      console.error('Bulk download failed:', error);
      setStatus('Le téléchargement a échoué');
      alert('Le téléchargement groupé a échoué. Veuillez réessayer.');
    } finally {
      setTimeout(() => {
        setProgress(0);
        setStatus('');
        setIsDownloading(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white shadow-md rounded-lg mb-6 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={selectedCount === totalCount ? onDeselectAll : onSelectAll}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            disabled={isDownloading}
          >
            {selectedCount === totalCount ? (
              <CheckSquare size={20} />
            ) : (
              <Square size={20} />
            )}
            <span>
              {selectedCount === totalCount ? 'Tout désélectionner' : 'Tout sélectionner'}
            </span>
          </button>
          <span className="text-gray-600">
            {selectedCount} image{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {(isDownloading || status) && (
            <div className="flex items-center gap-2">
              {isDownloading && (
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: '#055E4C'
                    }}
                  />
                </div>
              )}
              <span className="text-sm text-gray-600">{status}</span>
            </div>
          )}
          <button
            onClick={() => setShowShareModal(true)}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            <Share2 size={20} />
            <span>Partager la sélection</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
            style={{ 
              backgroundColor: '#055E4C',
              opacity: isDownloading ? '0.5' : '1',
              cursor: isDownloading ? 'not-allowed' : 'pointer'
            }}
          >
            {isDownloading ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Téléchargement en cours...</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>Télécharger la sélection</span>
              </>
            )}
          </button>
        </div>
      </div>

      <CreateSharedAlbumModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedImages={selectedImages.map(img => img.id)}
      />
    </>
  );
};