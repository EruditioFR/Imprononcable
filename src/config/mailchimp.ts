import { z } from 'zod';

const mailchimpConfigSchema = z.object({
  apiKey: z.string().min(1, 'Mailchimp API key is required'),
  serverPrefix: z.string().min(1, 'Server prefix is required'),
  listId: z.string().min(1, 'List ID is required'),
  fromEmail: z.string().email('Valid from email is required'),
  fromName: z.string().min(1, 'From name is required')
});

export type MailchimpConfig = z.infer<typeof mailchimpConfigSchema>;

export const MAILCHIMP_CONFIG: MailchimpConfig = {
  apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY || '',
  serverPrefix: import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX || '',
  listId: import.meta.env.VITE_MAILCHIMP_LIST_ID || '',
  fromEmail: 'jbbejot@gmail.com',
  fromName: 'Imprononcable'
};