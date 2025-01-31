import React from 'react';
import { Modal } from './Modal';
import { EditBriefForm } from '../Forms/EditBriefForm';
import type { Brief } from '../../../types/brief';

interface EditBriefModalProps {
  brief: Brief;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBriefModal({ brief, isOpen, onClose }: EditBriefModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier le brief"
    >
      <EditBriefForm brief={brief} onClose={onClose} />
    </Modal>
  );
}