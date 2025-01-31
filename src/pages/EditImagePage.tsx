import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';
import { EditImageForm } from '../components/ImageBank/EditImageForm';
import { useImage } from '../hooks/useImage';
import { useEditImage } from '../hooks/useEditImage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { ImageBankFormData } from '../types/imageBank';

export function EditImagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { image, loading, error: fetchError } = useImage(id!);
  const { editImage, isSubmitting, error: editError } = useEditImage();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (fetchError || !image) {
    return <ErrorMessage error={fetchError || new Error('Image non trouvée')} />;
  }

  const handleSubmit = async (data: ImageBankFormData) => {
    try {
      await editImage(id!, data);
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
            <ImageIcon className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier l'image
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de l'image ci-dessous
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <EditImageForm
            image={image}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={editError}
          />
        </div>
      </div>
    </div>
  );
}