import React from 'react';

interface LoadingProgressProps {
  progress: number;
}

export function LoadingProgress({ progress }: LoadingProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: '#055E4C'
          }}
        />
      </div>
      <p className="mt-4 text-gray-600">
        Chargement des images... {progress}%
      </p>
    </div>
  );
}