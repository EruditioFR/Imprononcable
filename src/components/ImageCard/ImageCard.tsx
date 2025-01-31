import React from 'react';
import { Image } from '../../types/gallery';
import { ImageDownloadButton } from '../ImageDownloadButton';
import { ImageHoverOverlay } from '../ImageHoverOverlay';
import { ExpiredRightsOverlay } from './ExpiredRightsOverlay';
import { Check } from 'lucide-react';

interface ImageCardProps {
  image: Image;
  onClick: () => void;
  onSelect: () => void;
  isSelected: boolean;
  isAdmin: boolean;
}

function convertDropboxUrl(url: string): string {
  return url.replace(/\?dl=0$/, '?raw=1')
           .replace(/&dl=0$/, '&raw=1');
}

export const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  onClick, 
  onSelect,
  isSelected,
  isAdmin 
}) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!image.rights.isExpired) {
      onSelect();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!image.rights.isExpired) {
      onClick();
    }
  };

  const thumbnailUrl = convertDropboxUrl(image.thumbnailUrl);
  const downloadUrl = convertDropboxUrl(image.url);

  return (
    <div className="break-inside-avoid mb-4">
      <div 
        className={`relative group cursor-pointer rounded-lg overflow-hidden ${
          image.rights.isExpired ? 'cursor-not-allowed' : ''
        }`}
        onClick={handleClick}
      >
        <img
          src={thumbnailUrl}
          alt={image.title}
          className={`w-full h-auto object-cover transition-transform duration-300 ${
            image.rights.isExpired ? 'filter grayscale' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />
        
        {image.rights.isExpired ? (
          <ExpiredRightsOverlay image={image} />
        ) : (
          <>
            <ImageHoverOverlay image={image} />
            <ImageDownloadButton
              url={downloadUrl}
              title={image.title}
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}

        <button
          onClick={handleSelect}
          className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : image.rights.isExpired
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  );
};