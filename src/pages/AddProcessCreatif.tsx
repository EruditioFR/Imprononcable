import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessCreatifForm } from '../components/ProcessCreatif/Form/ProcessCreatifForm';
import { useCreateProcessCreatif } from '../hooks/useCreateProcessCreatif';
import type { ProcessCreatifFormData } from '../types/processCreatif';

export function AddProcessCreatif() {
  const navigate = useNavigate();
  const { createProcess, isSubmitting, error } = useCreateProcessCreatif();

  const handleSubmit = async (data: ProcessCreatifFormData) => {
    try {
      await createProcess(data);
      navigate('/ressources');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Ajouter une ressource
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Créez une nouvelle ressource pour vos projets
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <ProcessCreatifForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onClose={() => navigate('/ressources')}
          />
        </div>
      </div>
    </div>
  );
}