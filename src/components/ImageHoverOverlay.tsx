import React from 'react';
import type { Image } from '../types/gallery';

interface ImageHoverOverlayProps {
  image: Image;
}

export const ImageHoverOverlay: React.FC<ImageHoverOverlayProps> = ({ image }) => (
  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
    <div className="flex flex-wrap gap-2">
      {image.categories.map((category) => (
        <span
          key={category}
          className="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm"
        >
          {category}
        </span>
      ))}
    </div>
  </div>
);