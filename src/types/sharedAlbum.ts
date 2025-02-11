import { z } from 'zod';

export interface SharedAlbum {
  id: string;
  title: string;
  description: string;
  password: string;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  status: 'active' | 'expired';
}

export interface AlbumImage {
  id: string;
  albumId: string;
  imageId: string;
  order: number;
}

export interface AlbumRecipient {
  id: string;
  albumId: string;
  email: string;
  sentAt: string;
  lastAccessedAt: string | null;
  accessCount: number;
}

export const createSharedAlbumSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string(),
  expiresAt: z.string().min(1, 'La date d\'expiration est requise'),
  recipients: z.array(z.string().email('Email invalide')).min(1, 'Au moins un destinataire est requis'),
  imageIds: z.array(z.string()).min(1, 'Au moins une image est requise')
});

export type CreateSharedAlbumData = z.infer<typeof createSharedAlbumSchema>;