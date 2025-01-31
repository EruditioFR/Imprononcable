import { z } from 'zod';

export type UserRole = 'Administrateur' | 'Utilisateur' | 'Presse';

export interface User {
  id: string;
  email: string;
  prenom?: string;
  client?: string | string[]; // Updated to support multiple clients
  role: UserRole;
  authorizedImageIds: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Le mot de passe actuel est requis'),
  newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;