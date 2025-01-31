import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageTitle: string;
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, imageTitle }: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-75" />
        
        <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="relative bg-white rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={imageTitle}
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <h3 className="text-lg font-medium">{imageTitle}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}