import { z } from 'zod';

export interface ProcessCreatif {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
  client: string;
  clientId: string;
  featuredImage?: string;
  videoUrl?: string | null;
}

export const processCreatifSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  client: z.string().min(1, 'Le client est requis'),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string(),
  authorId: z.string(),
  featuredImage: z.instanceof(File).optional().or(z.string().optional()),
  videoUrl: z.string().url('URL invalide').nullable().optional()
});

export type ProcessCreatifFormData = z.infer<typeof processCreatifSchema>;