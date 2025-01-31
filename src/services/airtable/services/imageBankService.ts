import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import type { Image } from '../../../types/gallery';

export class ImageBankService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  async getImages(clientId?: string): Promise<Image[]> {
    try {
      logInfo('ImageBankService', 'Fetching images', { clientId });

      const records = await this.base(AIRTABLE_CONFIG.tables.images)
        .select({
          view: 'Grid view'
        })
        .all();

      logInfo('ImageBankService', 'Records fetched from Airtable', {
        count: records.length
      });

      const images = records.map(record => {
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
      }).filter((image): image is Image => image !== null);

      logInfo('ImageBankService', 'Images processed', {
        total: images.length
      });

      return images;
    } catch (error) {
      logError('ImageBankService', 'Failed to fetch images', error);
      throw new AirtableError('Impossible de récupérer les images');
    }
  }

  async updateTags(imageId: string, tags: string): Promise<void> {
    try {
      logInfo('ImageBankService', 'Updating image tags', { imageId });

      await this.base(AIRTABLE_CONFIG.tables.images).update(imageId, {
        'tags proposés': tags
      });

      logInfo('ImageBankService', 'Tags updated successfully');
    } catch (error) {
      logError('ImageBankService', 'Failed to update tags', error);
      throw new AirtableError('Impossible de mettre à jour les mots-clés');
    }
  }
}

export const imageBankService = new ImageBankService();