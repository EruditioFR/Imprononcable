import { z } from 'zod';

// Schéma de validation pour le formulaire d'ajout d'image
export const imageBankSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  file: z.instanceof(File, { message: 'L\'image est requise' }),
  client: z.string().min(1, 'Le client est requis'),
  categories: z.array(z.string()).min(1, 'Au moins une catégorie est requise'),
  tags: z.array(z.string()),
  authorizedUsers: z.array(z.string()).min(1, 'Au moins un utilisateur autorisé est requis')
});

export type ImageBankFormData = z.infer<typeof imageBankSchema>;

export interface AuthorizedUser {
  id: string;
  name: string;
}

export interface ImageBankEntry {
  id: string;
  title: string;
  url: string;
  client: string;
  metadata: ImageMetadata | null;
  categories: string[];
  tags: string[];
  authorizedUsers: AuthorizedUser[];
}