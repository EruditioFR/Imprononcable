import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X } from 'lucide-react';
import type { ProcessCreatif } from '../../types/processCreatif';

interface ProcessCreatifModalProps {
  process: ProcessCreatif;
  isOpen: boolean;
  onClose: () => void;
}

export function ProcessCreatifModal({ process, isOpen, onClose }: ProcessCreatifModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {process.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Publié le {format(new Date(process.publishedAt), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: process.content }} />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}