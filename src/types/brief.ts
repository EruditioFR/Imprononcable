import { z } from 'zod';

export const briefSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  client: z.string().min(1, 'Le client est requis'),
  status: z.enum(['draft', 'published'])
});

export type BriefFormData = z.infer<typeof briefSchema>;

export interface Brief {
  id: string;
  title: string;
  content: string;
  author: string;
  client: string;
  publishedAt: string | null;
  status: 'draft' | 'published';
}