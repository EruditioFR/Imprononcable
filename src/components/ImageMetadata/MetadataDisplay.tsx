import React from 'react';
import type { ImageMetadata } from '../../types/metadata';
import { Camera, Calendar, Aperture, Timer, Zap, Ruler } from 'lucide-react';
import { AuthorDisplay } from './AuthorDisplay';

interface MetadataDisplayProps {
  metadata: ImageMetadata;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => {
  if (!metadata || Object.keys(metadata).length === 0) {
    console.debug('No metadata available for display');
    return null;
  }

  const availableFields = Object.entries(metadata)
    .filter(([_, value]) => value !== undefined)
    .map(([key]) => key);

  console.debug('Available metadata fields:', {
    fields: availableFields,
    values: Object.fromEntries(
      Object.entries(metadata)
        .filter(([_, value]) => value !== undefined)
    )
  });

  const formatExposureTime = (time?: string | number) => {
    if (!time) return null;
    if (typeof time === 'number') {
      return `${time}s`;
    }
    const [num, denom] = time.split('/');
    return `1/${Math.round(parseInt(denom) / parseInt(num))}s`;
  };

  const formatFocalLength = (length?: number) => {
    if (!length) return null;
    return `${Math.round(length)}mm`;
  };

  const metadataItems = [
    {
      icon: <Camera size={16} />,
      label: 'Appareil',
      value: metadata.model && `${metadata.make || ''} ${metadata.model}`.trim(),
    },
    {
      icon: <Calendar size={16} />,
      label: 'Date',
      value: metadata.dateTime,
    },
    {
      icon: <Aperture size={16} />,
      label: 'Ouverture',
      value: metadata.fNumber && `ƒ/${metadata.fNumber}`,
    },
    {
      icon: <Timer size={16} />,
      label: 'Vitesse',
      value: formatExposureTime(metadata.exposureTime),
    },
    {
      icon: <Zap size={16} />,
      label: 'ISO',
      value: metadata.iso,
    },
    {
      icon: <Ruler size={16} />,
      label: 'Focale',
      value: formatFocalLength(metadata.focalLength),
    },
  ].filter(item => item.value);

  console.debug('Metadata items for display:', {
    totalItems: metadataItems.length,
    items: metadataItems.map(item => ({
      label: item.label,
      value: item.value
    }))
  });

  if (metadataItems.length === 0 && !metadata.author) {
    console.debug('No metadata items or author to display');
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <AuthorDisplay author={metadata.author} />
      {metadataItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {metadataItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.icon}
              <div>
                <div className="text-white/60 text-xs">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};