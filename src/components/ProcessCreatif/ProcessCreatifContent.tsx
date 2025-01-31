import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

interface ProcessCreatifContentProps {
  content: string;
}

export function ProcessCreatifContent({ content }: ProcessCreatifContentProps) {
  return (
    <div className="max-w-none">
      <div 
        className="prose prose-lg prose-primary max-w-none mx-auto"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </div>
  );
}