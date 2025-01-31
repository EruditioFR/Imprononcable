import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';

interface BlogPostMetaProps {
  publishedAt: string;
  author: string;
  light?: boolean;
}

export function BlogPostMeta({ publishedAt, author, light = false }: BlogPostMetaProps) {
  const textColor = light ? 'text-white/90' : 'text-gray-500';

  return (
    <div className={`flex flex-wrap items-center gap-6 text-sm ${textColor}`}>
      <div className="flex items-center">
        <Calendar size={16} className="mr-2" />
        {format(new Date(publishedAt), 'dd MMMM yyyy', { locale: fr })}
      </div>
      <div className="flex items-center">
        <User size={16} className="mr-2" />
        {author}
      </div>
    </div>
  );
}