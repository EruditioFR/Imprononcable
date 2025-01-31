import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Brief } from '../../types/brief';

interface ViewBriefModalProps {
  brief: Brief;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewBriefModal({ brief, isOpen, onClose }: ViewBriefModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {brief.title}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>Par {brief.author}</span>
                <span>•</span>
                <span>Client : {brief.client}</span>
                <span>•</span>
                <span>
                  {brief.publishedAt 
                    ? format(new Date(brief.publishedAt), 'dd MMMM yyyy', { locale: fr })
                    : 'Non publié'
                  }
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  brief.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {brief.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: brief.content }} />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}