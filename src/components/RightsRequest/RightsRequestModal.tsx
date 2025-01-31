import React from 'react';
import { X } from 'lucide-react';
import type { Image } from '../../types/gallery';
import { RightsRequestForm } from './RightsRequestForm';
import { useRightsRequest } from './hooks/useRightsRequest';

interface RightsRequestModalProps {
  image: Image;
  isOpen: boolean;
  onClose: () => void;
}

export function RightsRequestModal({ image, isOpen, onClose }: RightsRequestModalProps) {
  const { isSubmitting, success, error, handleSubmit } = useRightsRequest(image, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Demande d'extension de droits
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          <RightsRequestForm
            image={image}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
            success={success}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}