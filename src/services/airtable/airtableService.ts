import Airtable from 'airtable';
import type { Image } from '../../types/gallery';
import { mapAirtableRecordToImage } from './imageMapper';

export class AirtableService {
  private base: Airtable.Base;
  private table: Airtable.Table<any>;

  constructor(apiKey: string, baseId: string, tableName: string) {
    try {
      Airtable.configure({ apiKey });
      this.base = new Airtable().base(baseId);
      this.table = this.base(tableName);
    } catch (error) {
      console.error('Failed to initialize Airtable service:', error);
      throw new Error('Erreur de configuration Airtable');
    }
  }

  async getImages(authorizedIds?: string[]): Promise<Image[]> {
    try {
      console.log('Fetching images from Airtable...', {
        hasAuthorizedIds: !!authorizedIds,
        authorizedCount: authorizedIds?.length
      });

      if (!authorizedIds?.length) {
        console.warn('No authorized image IDs provided');
        return [];
      }

      const filterFormula = `OR(${authorizedIds.map(id => `RECORD_ID()='${id}'`).join(',')})`;

      const records = await this.table.select({
        maxRecords: 100,
        view: 'Grid view',
        sort: [{ field: 'Title', direction: 'asc' }],
        filterByFormula: filterFormula
      }).all();

      console.log(`Successfully fetched ${records.length} records from Airtable`);

      const images = (await Promise.all(
        records.map(async record => {
          try {
            return await mapAirtableRecordToImage(record);
          } catch (error) {
            console.error('Failed to map record to image:', {
              recordId: record.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            return null;
          }
        })
      )).filter((image): image is Image => image !== null);

      console.log('Successfully processed all images:', {
        total: images.length,
        withMetadata: images.filter(img => !!img.metadata).length,
        withExpiredRights: images.filter(img => img.rights.isExpired).length
      });

      return images;
    } catch (error) {
      console.error('Failed to fetch images from Airtable:', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Impossible de récupérer les images depuis Airtable');
    }
  }
}