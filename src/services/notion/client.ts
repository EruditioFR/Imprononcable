import { Client } from '@notionhq/client';
import { createNotionClient } from './client/factory';
import { getPage } from './api/pages';
import { getPageBlocks } from './api/blocks';
import type { NotionBlock, NotionPage } from './types';

export class NotionClient {
  private client: Client;

  constructor() {
    this.client = createNotionClient();
  }

  async getPageContent(pageId: string): Promise<NotionBlock[]> {
    return getPageBlocks(this.client, pageId);
  }

  async getPage(pageId: string): Promise<NotionPage> {
    return getPage(this.client, pageId);
  }
}