import Airtable from 'airtable';
import type { Image } from '../../types/gallery';
import { mapAirtableRecordToImage } from './imageMapper';
import { logInfo, logError } from './utils/logging';
import { AirtableError } from './errors';

export class AirtableService {
  private base: Airtable.Base;
  private table: Airtable.Table<any>;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  constructor(apiKey: string, baseId: string, tableName: string) {
    try {
      Airtable.configure({ 
        apiKey,
        endpointUrl: 'https://api.airtable.com',
        apiVersion: '0.1.0',
        noRetryIfRateLimited: true,
        requestTimeout: 30000
      });
      this.base = new Airtable().base(baseId);
      this.table = this.base(tableName);
    } catch (error) {
      logError('AirtableService', 'Failed to initialize service', error);
      throw new AirtableError('Failed to initialize Airtable service');
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async withRetry<T>(operation: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate_limit') && attempt < this.MAX_RETRIES) {
        const delay = this.RETRY_DELAY * Math.pow(2, attempt);
        logInfo('AirtableService', `Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`);
        await this.sleep(delay);
        return this.withRetry(operation, attempt + 1);
      }
      throw error;
    }
  }

  async getImages(authorizedIds?: string[]): Promise<Image[]> {
    try {
      logInfo('AirtableService', 'Starting image fetch', {
        hasAuthorizedIds: !!authorizedIds,
        authorizedCount: authorizedIds?.length
      });

      if (!authorizedIds?.length) {
        logInfo('AirtableService', 'No authorized image IDs provided');
        return [];
      }

      const filterFormula = `OR(${authorizedIds.map(id => `RECORD_ID()='${id}'`).join(',')})`;

      const records = await this.withRetry(() =>
        this.table.select({
          filterByFormula: filterFormula,
          maxRecords: 100,
          view: 'Grid view'
        }).all()
      );

      logInfo('AirtableService', `Fetched ${records.length} records`);

      const images = (await Promise.all(
        records.map(mapAirtableRecordToImage)
      )).filter((image): image is Image => image !== null);

      logInfo('AirtableService', 'Successfully processed images', {
        total: images.length
      });

      return images;
    } catch (error) {
      logError('AirtableService', 'Failed to fetch images', error);
      throw new AirtableError('Failed to fetch images from Airtable');
    }
  }
}