import React from 'react';

interface BackgroundImageProps {
  src: string;
  alt: string;
}

export function BackgroundImage({ src, alt }: BackgroundImageProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}