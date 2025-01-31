import { z } from 'zod';
import { EmailError } from '../errors';

export const emailConfigSchema = z.object({
  mailjet: z.object({
    apiKey: z.string().min(1, 'API key is required'),
    apiSecret: z.string().min(1, 'API secret is required'),
    fromEmail: z.string().email('Invalid from email'),
    fromName: z.string().min(1, 'From name is required'),
    toEmail: z.string().email('Invalid to email'),
    toName: z.string().min(1, 'To name is required')
  })
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

export function validateEmailConfig(config: unknown): EmailConfig {
  try {
    return emailConfigSchema.parse(config);
  } catch (error) {
    throw new EmailError('Invalid email configuration', error);
  }
}