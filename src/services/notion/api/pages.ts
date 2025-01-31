import { Client } from '@notionhq/client';
import type { NotionPage } from '../types';
import { fetchWithErrorHandling } from './fetch';

export async function getPage(
  client: Client,
  pageId: string
): Promise<NotionPage> {
  return fetchWithErrorHandling(
    () => client.pages.retrieve({ page_id: pageId }),
    'Fetching page'
  ) as Promise<NotionPage>;
}