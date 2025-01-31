import React, { useState } from 'react';
import { X, AlertTriangle, Loader } from 'lucide-react';
import type { Brief } from '../../types/brief';

interface DeleteConfirmationModalProps {
  brief: Brief;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationModal({
  brief,
  isOpen,
  onClose,
  onConfirm
}: DeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (confirmText !== 'SUPPRIMER') return;

    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isDeleting}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer le brief "{brief.title}" ? Cette action est irréversible.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Pour confirmer, tapez "SUPPRIMER" ci-dessous :
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="SUPPRIMER"
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmText !== 'SUPPRIMER' || isDeleting}
              className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Suppression...</span>
                </>
              ) : (
                <span>Supprimer</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}