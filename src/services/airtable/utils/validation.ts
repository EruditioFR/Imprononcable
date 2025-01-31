import { z } from 'zod';
import { AirtableError } from '../errors';

export const airtableConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseId: z.string().min(1, 'Base ID is required'),
  tables: z.object({
    images: z.string(),
    users: z.string(),
    creaPhoto: z.string()
  })
});

export type AirtableConfig = z.infer<typeof airtableConfigSchema>;

export function validateConfig(config: unknown): AirtableConfig {
  try {
    return airtableConfigSchema.parse(config);
  } catch (error) {
    throw new AirtableError('Invalid Airtable configuration', error);
  }
}