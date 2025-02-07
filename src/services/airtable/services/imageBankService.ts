import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import type { Image } from '../../../types/gallery';

export class ImageBankService {
  private base: Airtable.Base;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor() {
    Airtable.configure({ 
      apiKey: AIRTABLE_CONFIG.apiKey,
      endpointUrl: 'https://api.airtable.com',
      apiVersion: '0.1.0',
      noRetryIfRateLimited: true // We'll handle retries ourselves
    });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(operation: () => Promise<any>, attempt: number = 0): Promise<any> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate_limit') && attempt < this.MAX_RETRIES) {
        logInfo('ImageBankService', `Rate limited, retrying in ${this.RETRY_DELAY}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`);
        await this.sleep(this.RETRY_DELAY * Math.pow(2, attempt));
        return this.fetchWithRetry(operation, attempt + 1);
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
          // Utiliser select() au lieu de all() pour un meilleur contrôle
          const query = this.base(AIRTABLE_CONFIG.tables.images).select({
            pageSize: 100,
            offset,
            view: 'Grid view'
          });

          // Récupérer une page avec retry
          const page = await this.fetchWithRetry(() => query.firstPage());
          
          pageCount++;
          logInfo('ImageBankService', `Fetched page ${pageCount}`, {
            recordCount: page.length,
            hasMore: !!query.offset
          });

          allRecords.push(...page);
          offset = query.offset;

          // Pause entre les pages pour éviter le rate limiting
          if (offset) {
            await this.sleep(250);
          }

        } catch (error) {
          logError('ImageBankService', 'Error fetching page', error);
          throw new AirtableError(
            `Failed to fetch page ${pageCount + 1}`,
            error instanceof Error ? error : undefined
          );
        }
      } while (offset);

      logInfo('ImageBankService', 'Finished fetching records', {
        totalPages: pageCount,
        totalRecords: allRecords.length
      });

      // Traiter les enregistrements
      const images = allRecords
        .map(record => {
          try {
            const hdUrl = record.get('url drpbx HD') as string;
            const thumbnailUrl = record.get('url drpbx miniatures') as string;
            const format = record.get('Format') as string;
            const projet = record.get('Projet') as string;
            
            if (!hdUrl && !thumbnailUrl) {
              logError('ImageBankService', 'Missing image URLs', {
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
              client: '',
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
      throw new AirtableError(
        'Impossible de récupérer les images',
        error instanceof Error ? error : undefined
      );
    }
  }

  async updateTags(imageId: string, tags: string): Promise<void> {
    try {
      logInfo('ImageBankService', 'Updating image tags', { imageId });

      await this.fetchWithRetry(() => 
        this.base(AIRTABLE_CONFIG.tables.images).update(imageId, {
          'tags proposés': tags
        })
      );

      logInfo('ImageBankService', 'Tags updated successfully');
    } catch (error) {
      logError('ImageBankService', 'Failed to update tags', error);
      throw new AirtableError(
        'Impossible de mettre à jour les mots-clés',
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const imageBankService = new ImageBankService();