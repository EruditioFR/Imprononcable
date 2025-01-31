import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBlogPost } from '../hooks/useBlogPost';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { BlogPostHeader } from '../components/Blog/Header/BlogPostHeader';
import { BlogContent } from '../components/Blog/Content/BlogContent';

export function BlogPostPage() {
  const { id } = useParams();
  const { post, loading, error } = useBlogPost(id!);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Article non trouvé</p>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      {post.image && (
        <div className="relative w-full h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          
          {/* Breadcrumb on top of hero */}
          <div className="absolute top-8 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav>
                <ol className="flex items-center space-x-2 text-sm text-white/90">
                  <li>
                    <Link to="/blog" className="hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <ChevronRight size={16} />
                  </li>
                  <li className="font-medium truncate max-w-[300px]">
                    {post.title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Title and Meta on top of hero */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent pt-32 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <BlogPostHeader post={post} withHero />
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show header if no hero image */}
        {!post.image && <BlogPostHeader post={post} />}

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
          <BlogContent content={post.content} />
        </div>
      </div>
    </article>
  );
}