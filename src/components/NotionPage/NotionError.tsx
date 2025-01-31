import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NotionErrorProps {
  error: Error;
}

export function NotionError({ error }: NotionErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Impossible de charger le contenu
      </h2>
      <p className="text-gray-600 mb-4">
        {error.message}
      </p>
      <p className="text-sm text-gray-500">
        Veuillez vérifier que la page existe et que vous avez les permissions nécessaires.
      </p>
    </div>
  );
}