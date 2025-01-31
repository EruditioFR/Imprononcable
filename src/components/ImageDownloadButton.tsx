import React from 'react';
import { Download } from 'lucide-react';
import { downloadImage } from '../utils/download';

interface ImageDownloadButtonProps {
  url: string;
  title: string;
  onClick: (e: React.MouseEvent) => void;
}

export const ImageDownloadButton: React.FC<ImageDownloadButtonProps> = ({
  url,
  title,
  onClick,
}) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await downloadImage(url, `${title}.jpg`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Le téléchargement a échoué. Veuillez réessayer.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      title={`Télécharger ${title}`}
    >
      <Download size={20} className="text-gray-700" />
    </button>
  );
};