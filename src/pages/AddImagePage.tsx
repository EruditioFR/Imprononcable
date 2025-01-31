import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import { AddImageForm } from '../components/ImageBank/AddImageForm';
import { useAddImage } from '../hooks/useAddImage';
import type { ImageBankFormData } from '../types/imageBank';

export function AddImagePage() {
  const navigate = useNavigate();
  const { addImage, isSubmitting, error } = useAddImage();

  const handleSubmit = async (data: ImageBankFormData) => {
    try {
      await addImage(data);
      navigate('/banque-images/admin');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <ImagePlus className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Ajouter une image
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Ajoutez une nouvelle image à la banque d'images en remplissant le formulaire ci-dessous
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <AddImageForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}