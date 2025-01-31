import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useProcessCreatifDetail } from '../hooks/useProcessCreatifDetail';
import { processCreatifService } from '../services/airtable/services/processCreatifService';
import { ProcessCreatifForm } from '../components/ProcessCreatif/Form/ProcessCreatifForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ProcessCreatifFormData } from '../types/processCreatif';

export function EditProcessCreatifPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { process, loading, error } = useProcessCreatifDetail(id!);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !process) {
    return (
      <div className="text-center text-red-600">
        <p>Une erreur est survenue lors du chargement de la ressource.</p>
        <p className="text-sm mt-2">{error?.message || 'Ressource non trouvée'}</p>
      </div>
    );
  }

  const handleSubmit = async (data: ProcessCreatifFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await processCreatifService.updateProcess(id!, data);
      navigate('/ressources/manage');
    } catch (err) {
      console.error('Failed to update resource:', err);
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Récupérer l'URL de l'image attachée depuis le record Airtable
  const attachmentUrl = process['image à la une']?.[0]?.url;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier la ressource
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de la ressource ci-dessous
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProcessCreatifForm
            initialData={{
              title: process.title,
              content: process.content,
              client: process.clientId,
              publishedAt: process.publishedAt,
              status: 'published',
              authorId: '',
              featuredImage: process.featuredImage
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
            onClose={() => navigate('/ressources/manage')}
            attachmentUrl={attachmentUrl}
          />
        </div>
      </div>
    </div>
  );
}