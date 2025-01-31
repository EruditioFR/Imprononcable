import { z } from 'zod';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  client: string;
  clientId: string;
  publishedAt: string;
  excerpt: string;
  mediaLibraryUrl: string | null;
  uploadedImage: string | null;
  image: string | null;
  category: string;
  status: 'draft' | 'published';
}

const baseSchema = {
  title: z.string().min(1, 'Le titre est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  excerpt: z.string().min(1, 'L\'extrait est requis'),
  category: z.string().min(1, 'La catégorie est requise'),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string(),
  image: z.string().optional(),
  client: z.string().min(1, 'Le client est requis'),
  authorId: z.string()
};

export type BlogFormData = z.infer<typeof blogSchema>;

export const blogSchema = z.object(baseSchema);