import React from 'react';
import { ProcessCreatifCard } from './ProcessCreatifCard';
import type { ProcessCreatif } from '../../types/processCreatif';

interface ProcessCreatifListProps {
  processes: ProcessCreatif[];
}

export function ProcessCreatifList({ processes }: ProcessCreatifListProps) {
  if (processes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">
          Aucun process créatif disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {processes.map((process) => (
        <ProcessCreatifCard key={process.id} process={process} />
      ))}
    </div>
  );
}