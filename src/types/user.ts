import { z } from 'zod';

export type UserRole = 'Administrateur' | 'Utilisateur';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  client: string;
  role: UserRole;
  status: string;
}

// Base schema with common fields
const baseUserSchema = {
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Adresse email invalide'),
  client: z.string().min(1, 'Le client est requis'),
  role: z.enum(['Administrateur', 'Utilisateur'], {
    required_error: 'Le rôle est requis'
  })
};

// Schema for creating new users (includes password fields)
export const userSchema = z.object({
  ...baseUserSchema,
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

// Schema for editing users (no password fields)
export const userEditSchema = z.object({
  ...baseUserSchema
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;