import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, Loader, Download } from 'lucide-react';
import { sharedAlbumService } from '../services/airtable/services/sharedAlbumService';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { downloadImage, downloadImages } from '../utils/download';

export function SharedAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [album, setAlbum] = useState<{
    title: string;
    description: string;
    images: string[];
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const albumData = await sharedAlbumService.getSharedAlbum(id, password);
      if (!albumData) {
        setError('Album introuvable ou mot de passe incorrect');
        return;
      }

      const imageUrls = await sharedAlbumService.getAlbumImages(id);

      setAlbum({
        title: albumData.title,
        description: albumData.description,
        images: imageUrls
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async (url: string, index: number) => {
    try {
      await downloadImage(url, `image-${index + 1}.jpg`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Le téléchargement a échoué. Veuillez réessayer.');
    }
  };

  const handleDownloadAll = async () => {
    if (!album?.images.length) return;

    try {
      setIsDownloading(true);
      await downloadImages(
        album.images.map((url, index) => ({
          id: `${index}`,
          url,
          title: `image-${index + 1}`,
          thumbnailUrl: url,
          categories: [],
          tags: [],
          client: '',
          width: 1200,
          height: 800,
          rights: { startDate: null, endDate: null, isExpired: false }
        })),
        (progress) => setDownloadProgress(progress)
      );
    } catch (error) {
      console.error('Bulk download failed:', error);
      alert('Le téléchargement groupé a échoué. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const breakpointColumns = {
    default: 4,
    1536: 3,
    1280: 3,
    1024: 2,
    768: 2,
    640: 1
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Album introuvable</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary-100 rounded-full">
                <Lock className="h-10 w-10 text-primary-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-center mb-8">
              Album protégé
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Vérification...</span>
                  </>
                ) : (
                  <span>Accéder à l'album</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {album.title}
              </h1>
              {album.description && (
                <p className="text-gray-600">{album.description}</p>
              )}
            </div>
            
            {album.images.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>{downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Tout télécharger</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {album.images.map((imageUrl, index) => (
            <div 
              key={index}
              className="mb-4 group relative"
            >
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-sm"
                loading="lazy"
                onClick={() => setSelectedImage(index)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage(imageUrl, index);
                  }}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="Télécharger l'image"
                >
                  <Download size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </Masonry>

        <Lightbox
          open={selectedImage !== null}
          index={selectedImage || 0}
          close={() => setSelectedImage(null)}
          slides={album.images.map(url => ({ src: url }))}
        />
      </div>
    </div>
  );
}