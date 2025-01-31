import React, { useState } from 'react';
import { Loader } from 'lucide-react';

interface ImageThumbnailProps {
  src: string;
  alt: string;
  size?: number;
}

export function ImageThumbnail({ src, alt, size = 64 }: ImageThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Générer l'URL de la miniature optimisée
  const thumbnailUrl = src.includes('dl.airtable.com') 
    ? `${src.split('?')[0]}?w=${size * 2}&h=${size * 2}&fit=crop&auto=format` 
    : src;

  return (
    <div 
      className="relative bg-gray-100 rounded overflow-hidden"
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-500">Error</span>
        </div>
      ) : (
        <img
          src={thumbnailUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
}