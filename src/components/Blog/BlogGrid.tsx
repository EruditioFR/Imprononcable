import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, Tag, Pencil } from 'lucide-react';
import { useRoleCheck } from '../../hooks/useRoleCheck';
import type { BlogPost } from '../../types/blog';

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const { isAdmin } = useRoleCheck();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun article disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="relative">
            {post.image && (
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {post.category && (
                  <div className="relative top-4 left-4">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-primary-500/80 backdrop-blur-sm rounded-full">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Link 
                  to={`/ensemble/${post.id}`}
                  className="block flex-1"
                >
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                {isAdmin() && (
                  <div className="ml-4">
                    <Link
                      to={`/ensemble/edit/${post.id}`}
                      className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      <Pencil size={18} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {format(new Date(post.publishedAt), 'dd MMMM yyyy', { locale: fr })}
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  {post.author}
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={16} className="text-gray-400" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}