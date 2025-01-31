import React from 'react';
import { Image } from '../types/gallery';
import { ImageDownloadButton } from './ImageDownloadButton';
import { ImageHoverOverlay } from './ImageHoverOverlay';
import { Check } from 'lucide-react';

interface ImageCardProps {
  image: Image;
  onClick: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  onClick, 
  onSelect,
  isSelected 
}) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div className="break-inside-avoid mb-4">
      <div 
        className="relative group cursor-pointer rounded-lg overflow-hidden"
        onClick={onClick}
      >
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <ImageHoverOverlay image={image} />
        <ImageDownloadButton
          url={image.url}
          title={image.title}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={handleSelect}
          className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  );
};