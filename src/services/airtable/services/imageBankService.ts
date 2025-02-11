import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import type { Image } from '../../../types/gallery';

export class ImageBankService {
  private base: Airtable.Base;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;
  private readonly PAGE_SIZE = 50;

  constructor() {
    try {
      Airtable.configure({ 
        apiKey: AIRTABLE_CONFIG.apiKey,
        endpointUrl: 'https://api.airtable.com',
        apiVersion: '0.1.0',
        noRetryIfRateLimited: true,
        requestTimeout: 30000
      });
      this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
    } catch (error) {
      logError('ImageBankService', 'Failed to initialize service', error);
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
        logInfo('ImageBankService', `Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`);
        await this.sleep(delay);
        return this.withRetry(operation, attempt + 1);
      }

      throw error;
    }
  }

  async getImages(clientId?: string): Promise<Image[]> {
    try {
      logInfo('ImageBankService', 'Starting image fetch', { clientId });

      const allRecords = [];
      let offset: string | undefined;
      let pageCount = 0;

      do {
        try {
          const query = this.base(AIRTABLE_CONFIG.tables.images).select({
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
          });

          const page = await this.withRetry(() => query.firstPage());
          
          pageCount++;
          logInfo('ImageBankService', `Fetched page ${pageCount}`, {
            recordCount: page.length,
            hasMore: !!query.offset
          });

          allRecords.push(...page);
          offset = query.offset;

          if (offset) {
            await this.sleep(250); // Rate limit prevention
          }

        } catch (error) {
          if (error instanceof Error && error.message.includes('AUTHENTICATION_REQUIRED')) {
            throw new AirtableError('Authentication failed - please check your API key');
          }
          if (error instanceof Error && error.message.includes('NOT_FOUND')) {
            throw new AirtableError('Table or base not found - please check your configuration');
          }
          throw error;
        }
      } while (offset);

      logInfo('ImageBankService', 'Finished fetching records', {
        totalPages: pageCount,
        totalRecords: allRecords.length
      });

      const images = allRecords
        .map(record => {
          try {
            const hdUrl = record.get('url drpbx HD') as string;
            const thumbnailUrl = record.get('url drpbx miniatures') as string;
            const format = record.get('Format') as string;
            const projet = record.get('Projet') as string;
            
            if (!thumbnailUrl) {
              logError('ImageBankService', 'Missing required fields', {
                recordId: record.id,
                title: record.get('Nom image')
              });
              return null;
            }

            return {
              id: record.id,
              title: record.get('Nom image') as string || '',
              url: hdUrl || thumbnailUrl,
              thumbnailUrl: thumbnailUrl || hdUrl,
              hdUrl: hdUrl || null,
              Format: format || '',
              Projet: projet || '',
              "tags proposés": record.get('tags proposés') as string,
              categories: [],
              tags: [],
              client: (record.get('Client') as string[])?.[0] || '',
              width: 1200,
              height: 800,
              rights: {
                startDate: record.get('debut_droits') as string,
                endDate: record.get('fin_droits') as string,
                isExpired: false
              }
            };
          } catch (error) {
            logError('ImageBankService', 'Error processing record', {
              recordId: record.id,
              error
            });
            return null;
          }
        })
        .filter((image): image is Image => image !== null);

      logInfo('ImageBankService', 'Successfully processed images', {
        totalImages: images.length,
        skippedRecords: allRecords.length - images.length
      });

      return images;
    } catch (error) {
      logError('ImageBankService', 'Failed to fetch images', error);
      
      if (error instanceof AirtableError) {
        throw error;
      }
      
      throw new AirtableError(
        'Failed to fetch images. Please check your connection and try again.',
        error instanceof Error ? error : undefined
      );
    }
  }

  async updateTags(imageId: string, tags: string): Promise<void> {
    try {
      logInfo('ImageBankService', 'Updating image tags', { imageId });

      await this.withRetry(() => 
        this.base(AIRTABLE_CONFIG.tables.images).update(imageId, {
          'tags proposés': tags
        })
      );

      logInfo('ImageBankService', 'Tags updated successfully');
    } catch (error) {
      logError('ImageBankService', 'Failed to update tags', error);
      throw new AirtableError(
        'Failed to update tags',
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const imageBankService = new ImageBankService();