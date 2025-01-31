import React from 'react';
import { Edit, Trash2, Clock } from 'lucide-react';
import type { Article } from '../../types/blog';
import { formatFrenchDate } from '../../utils/dates';

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun article disponible
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map(article => (
        <div
          key={article.id}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Clock size={16} />
                <span>
                  {article.publishedAt 
                    ? formatFrenchDate(article.publishedAt)
                    : 'Non publié'
                  }
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {article.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(article)}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Modifier"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(article.id)}
                className="p-2 text-gray-400 hover:text-red-500"
                title="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            {article.content}
          </div>
        </div>
      ))}
    </div>
  );
}