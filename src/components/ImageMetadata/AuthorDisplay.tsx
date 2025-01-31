import React from 'react';
import { User } from 'lucide-react';

interface AuthorDisplayProps {
  author?: string;
}

export const AuthorDisplay: React.FC<AuthorDisplayProps> = ({ author }) => {
  if (!author) return null;

  return (
    <div className="flex items-center gap-2 text-white mb-3">
      <User size={16} className="text-white/80" />
      <span className="text-sm font-medium">{author}</span>
    </div>
  );
};