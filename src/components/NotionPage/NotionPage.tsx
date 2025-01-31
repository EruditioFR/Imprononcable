import React from 'react';
import { useNotionContent } from '../../services/notion/hooks/useNotionContent';
import { NotionContent } from './NotionContent';
import { NotionError } from './NotionError';
import { LoadingSpinner } from '../LoadingSpinner';

interface NotionPageProps {
  pageId: string;
}

export function NotionPage({ pageId }: NotionPageProps) {
  const { content, loading, error } = useNotionContent(pageId);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <NotionError error={error} />;
  }

  if (!content.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun contenu disponible
      </div>
    );
  }

  return <NotionContent blocks={content} />;
}