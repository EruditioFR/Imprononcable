import { z } from 'zod';
import { ERROR_MESSAGES } from './constants';

export const notionConfigSchema = z.object({
  apiKey: z.string().min(1, ERROR_MESSAGES.MISSING_API_KEY),
  pageId: z.string().min(1, ERROR_MESSAGES.MISSING_PAGE_ID)
});

export type NotionConfig = z.infer<typeof notionConfigSchema>;

export function validateConfig(config: unknown): NotionConfig {
  try {
    return notionConfigSchema.parse(config);
  } catch (error) {
    console.error('Notion config validation failed:', error);
    throw new Error(ERROR_MESSAGES.INVALID_CONFIG);
  }
}