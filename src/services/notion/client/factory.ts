import { Client } from '@notionhq/client';
import { NOTION_CONFIG } from '../../../config/notion';
import { NOTION_API_VERSION } from '../constants';
import { NotionError } from '../errors';
import { ERROR_MESSAGES } from '../constants';

export function createNotionClient(): Client {
  if (!NOTION_CONFIG.apiKey) {
    throw new NotionError(ERROR_MESSAGES.MISSING_API_KEY);
  }

  try {
    return new Client({
      auth: NOTION_CONFIG.apiKey,
      notionVersion: NOTION_API_VERSION
    });
  } catch (error) {
    throw new NotionError(
      'Failed to create Notion client',
      error instanceof Error ? error : undefined
    );
  }
}