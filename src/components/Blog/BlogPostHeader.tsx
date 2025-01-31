import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BlogPostMeta } from './BlogPostMeta';
import { CategoryBadge } from './Categories/CategoryBadge';
import { TagList } from './Tags/TagList';
import type { BlogPost } from '../../types/blog';

interface BlogPostHeaderProps {
  post: BlogPost;
  withHero?: boolean;
}

export function BlogPostHeader({ post, withHero = false }: BlogPostHeaderProps) {
  const headerContent = (
    <>
      {post.category && (
        <div className="mb-4">
          <CategoryBadge category={post.category} light={withHero} />
        </div>
      )}
      <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${
        withHero ? 'text-white' : 'text-gray-900'
      }`}>
        {post.title}
      </h1>
      <BlogPostMeta 
        publishedAt={post.publishedAt}
        author={post.author}
        light={withHero}
      />
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          <TagList tags={post.tags} light={withHero} />
        </div>
      )}
    </>
  );

  if (withHero) {
    return headerContent;
  }

  return (
    <header className="mb-12">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/ensemble" className="hover:text-primary-600">
              Ensemble
            </Link>
          </li>
          <li>
            <ChevronRight size={16} />
          </li>
          <li className="text-gray-900 font-medium truncate">
            {post.title}
          </li>
        </ol>
      </nav>
      {headerContent}
    </header>
  );
}