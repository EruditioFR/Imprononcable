import React from 'react';
import { Image } from 'lucide-react';

interface FormatFilterProps {
  selectedFormat: string | null;
  onFormatSelect: (format: string | null) => void;
}

export const FormatFilter: React.FC<FormatFilterProps> = ({
  selectedFormat,
  onFormatSelect,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Filtrer par format</h3>
      <div className="flex gap-2">
        <button
          onClick={() => onFormatSelect(selectedFormat === 'Portrait' ? null : 'Portrait')}
          className={`h-10 px-4 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            selectedFormat === 'Portrait'
              ? 'text-white bg-primary-500 hover:bg-primary-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Image className="h-4 w-4" />
          <span>Portrait</span>
          {selectedFormat === 'Portrait' && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              Actif
            </span>
          )}
        </button>
        <button
          onClick={() => onFormatSelect(selectedFormat === 'Paysage' ? null : 'Paysage')}
          className={`h-10 px-4 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            selectedFormat === 'Paysage'
              ? 'text-white bg-primary-500 hover:bg-primary-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Image className="h-4 w-4" />
          <span>Paysage</span>
          {selectedFormat === 'Paysage' && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              Actif
            </span>
          )}
        </button>
      </div>
    </div>
  );
};