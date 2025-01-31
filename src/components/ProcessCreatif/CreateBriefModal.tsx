import React from 'react';
import { X } from 'lucide-react';
import { CreateBriefForm } from './CreateBriefForm';

interface CreateBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBriefModal({ isOpen, onClose }: CreateBriefModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Créer un brief créatif
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <CreateBriefForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
}