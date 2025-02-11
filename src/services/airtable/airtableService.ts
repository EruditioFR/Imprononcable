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
  private readonly PAGE_SIZE = 100;
  private readonly CONCURRENT_REQUESTS = 3;

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
      const isRateLimit = error instanceof Error && 
        (error.message.includes('rate_limit') || error.message.includes('429'));
      
      if (isRateLimit && attempt < this.MAX_RETRIES) {
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

      // Split authorized IDs into chunks to avoid URL length limits
      const chunks = [];
      for (let i = 0; i < authorizedIds.length; i += 100) {
        chunks.push(authorizedIds.slice(i, i + 100));
      }

      logInfo('AirtableService', 'Processing in chunks', {
        totalChunks: chunks.length,
        chunkSize: 100
      });

      const allRecords = [];
      
      // Process chunks with concurrency limit
      for (let i = 0; i < chunks.length; i += this.CONCURRENT_REQUESTS) {
        const currentChunks = chunks.slice(i, i + this.CONCURRENT_REQUESTS);
        
        const chunkPromises = currentChunks.map(async chunk => {
          const filterFormula = `OR(${chunk.map(id => `RECORD_ID()='${id}'`).join(',')})`;
          let records = [];
          let offset: string | undefined;

          do {
            const response = await this.withRetry(() =>
              this.table.select({
                filterByFormula: filterFormula,
                pageSize: this.PAGE_SIZE,
                offset,
                view: 'Grid view',
                fields: [
                  'Nom image',
                  'url drpbx HD',
                  'url drpbx miniatures',
                  'Format',
                  'Projet',
                  'tags proposés',
                  'Client',
                  'debut_droits',
                  'fin_droits'
                ]
              }).firstPage()
            );

            records.push(...response);
            offset = (response as any)._offset;

            if (offset) {
              // Small delay between pages to avoid rate limiting
              await this.sleep(100);
            }
          } while (offset);

          return records;
        });

        const chunkResults = await Promise.all(chunkPromises);
        allRecords.push(...chunkResults.flat());

        // Small delay between chunk batches
        if (i + this.CONCURRENT_REQUESTS < chunks.length) {
          await this.sleep(500);
        }
      }

      logInfo('AirtableService', 'Records fetched successfully', {
        totalRecords: allRecords.length
      });

      // Process records in parallel with a concurrency limit
      const images = [];
      for (let i = 0; i < allRecords.length; i += this.CONCURRENT_REQUESTS) {
        const batch = allRecords.slice(i, i + this.CONCURRENT_REQUESTS);
        const processedBatch = await Promise.all(
          batch.map(record => mapAirtableRecordToImage(record))
        );
        images.push(...processedBatch.filter((img): img is Image => img !== null));
      }

      logInfo('AirtableService', 'Images processed successfully', {
        totalImages: images.length,
        validImages: images.length,
        invalidImages: allRecords.length - images.length
      });

      return images;
    } catch (error) {
      logError('AirtableService', 'Failed to fetch images', error);
      throw new AirtableError(
        'Failed to fetch images from Airtable',
        error instanceof Error ? error : undefined
      );
    }
  }
}