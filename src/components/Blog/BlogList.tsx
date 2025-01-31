import React from 'react';
import { BlogPostCard } from './BlogPostCard';
import type { BlogPost } from '../../types/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  // Group posts by category
  const postsByCategory = posts.reduce((acc, post) => {
    if (post.category) {
      if (!acc[post.category]) {
        acc[post.category] = [];
      }
      acc[post.category].push(post);
    }
    return acc;
  }, {} as Record<string, BlogPost[]>);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun article disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {category}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categoryPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}