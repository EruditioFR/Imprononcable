import React, { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { ViewBriefModal } from './Modals/ViewBriefModal';
import { EditBriefModal } from './Modals/EditBriefModal';
import { DeleteBriefModal } from './Modals/DeleteBriefModal';
import type { Brief } from '../../types/brief';

interface BriefActionsProps {
  brief: Brief;
  onDelete: (id: string) => Promise<void>;
}

export function BriefActions({ brief, onDelete }: BriefActionsProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsViewModalOpen(true)}
          className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
          title="Visualiser"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
          title="Modifier"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <ViewBriefModal
        brief={brief}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <EditBriefModal
        brief={brief}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteBriefModal
        brief={brief}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(brief.id)}
      />
    </>
  );
}