import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Modal } from './Modal';
import type { Brief } from '../../../types/brief';

interface ViewBriefModalProps {
  brief: Brief;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewBriefModal({ brief, isOpen, onClose }: ViewBriefModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails du brief"
    >
      <div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
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

        <div className="prose prose-blue max-w-none">
          <div dangerouslySetInnerHTML={{ __html: brief.content }} />
        </div>
      </div>
    </Modal>
  );
}