import React from 'react';

interface ErrorMessageProps {
  error: Error;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center text-red-600">
      <p>Une erreur est survenue lors du chargement des images.</p>
      <p className="text-sm mt-2">{error.message}</p>
    </div>
  </div>
);