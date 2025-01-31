import { z } from 'zod';

export const emailConfigSchema = z.object({
  mailchimp: z.object({
    apiKey: z.string().min(1, 'API key is required'),
    serverPrefix: z.string().min(1, 'Server prefix is required'),
    listId: z.string().min(1, 'List ID is required')
  }),
  email: z.object({
    fromAddress: z.string().email('Valid from email is required'),
    fromName: z.string().min(1, 'From name is required'),
    toAddress: z.string().email('Valid to email is required'),
    toName: z.string().min(1, 'To name is required')
  })
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;