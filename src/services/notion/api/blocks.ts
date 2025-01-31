import { Client } from '@notionhq/client';
import type { NotionBlock } from '../types';
import { fetchWithErrorHandling } from './fetch';
import { logInfo } from '../utils/logging';

export async function getPageBlocks(
  client: Client,
  blockId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  try {
    do {
      logInfo('Fetching blocks', { blockId, cursor });
      
      const response = await fetchWithErrorHandling(
        () => client.blocks.children.list({
          block_id: blockId,
          start_cursor: cursor,
          page_size: 100
        }),
        'Fetching blocks'
      );

      const newBlocks = response.results as NotionBlock[];
      blocks.push(...newBlocks);
      
      logInfo('Fetched blocks', { 
        count: newBlocks.length,
        hasMore: !!response.next_cursor 
      });

      cursor = response.next_cursor || undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    throw error;
  }
}