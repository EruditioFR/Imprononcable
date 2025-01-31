import { z } from 'zod';

export type ContentType = 'article' | 'resource' | 'image' | 'user';

export interface ActivityItem {
  id: string;
  type: ContentType;
  title: string;
  action: 'create' | 'update';
  timestamp: string;
  author: string;
  authorId: string;
  contentId: string;
  status?: 'draft' | 'published';
  url?: string;
}

export const activitySchema = z.object({
  type: z.enum(['article', 'resource', 'image', 'user']),
  title: z.string().min(1, 'Title is required'),
  action: z.enum(['create', 'update']),
  timestamp: z.string(),
  author: z.string(),
  authorId: z.string(),
  contentId: z.string(),
  status: z.enum(['draft', 'published']).optional(),
  url: z.string().optional()
});