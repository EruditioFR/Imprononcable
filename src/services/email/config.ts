import { z } from 'zod';

const mailjetConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiSecret: z.string().min(1, 'API secret is required'),
  fromEmail: z.string().email('Invalid from email'),
  fromName: z.string().min(1, 'From name is required'),
  toEmail: z.string().email('Invalid to email'),
  toName: z.string().min(1, 'To name is required')
});

export const EMAIL_CONFIG = {
  mailjet: {
    apiKey: import.meta.env.VITE_MAILJET_API_KEY || '',
    apiSecret: import.meta.env.VITE_MAILJET_API_SECRET || '',
    fromEmail: 'jbbejot@gmail.com',
    fromName: 'Banque d\'images',
    toEmail: 'jbbejot@gmail.com',
    toName: 'Jean-Baptiste Bejot'
  }
} as const;

export function validateMailjetConfig(config: unknown) {
  return mailjetConfigSchema.parse(config);
}