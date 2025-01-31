import { z } from 'zod';

export const emailTemplateSchema = z.object({
  name: z.string(),
  subject: z.string(),
  fromName: z.string(),
  fromEmail: z.string().email(),
});

export const EMAIL_TEMPLATES = {
  welcome: {
    name: 'welcome-email',
    subject: 'Bienvenue sur CollabSpace',
    fromName: 'CollabSpace',
    fromEmail: 'noreply@collabspace.com',
  },
  rightsRequest: {
    name: 'rights-request',
    subject: 'Nouvelle demande d\'extension de droits',
    fromName: 'CollabSpace',
    fromEmail: 'noreply@collabspace.com',
  },
  passwordReset: {
    name: 'password-reset',
    subject: 'Réinitialisation de votre mot de passe',
    fromName: 'CollabSpace',
    fromEmail: 'noreply@collabspace.com',
  }
} as const;