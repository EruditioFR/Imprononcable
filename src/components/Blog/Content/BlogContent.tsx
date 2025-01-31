import React from 'react';
import { sanitizeHtml } from '../../../utils/sanitize';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div 
      className="prose prose-lg prose-blue max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  );
}