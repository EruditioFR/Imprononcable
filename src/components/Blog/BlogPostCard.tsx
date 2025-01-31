import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';
import { CategoryBadge } from './Categories/CategoryBadge';
import { TagList } from './Tags/TagList';
import type { BlogPost } from '../../types/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
          {post.category && (
            <div className="absolute top-4 left-4">
              <CategoryBadge category={post.category} light />
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link to={`/ensemble/${post.id}`} className="hover:text-primary-600">
            {post.title}
          </Link>
        </h2>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {format(new Date(post.publishedAt), 'dd MMMM yyyy', { locale: fr })}
          </div>
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            {post.author}
          </div>
        </div>

        {!post.image && post.category && (
          <div className="mb-4">
            <CategoryBadge category={post.category} />
          </div>
        )}

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <TagList tags={post.tags} />
          </div>
        )}
      </div>
    </article>
  );
}