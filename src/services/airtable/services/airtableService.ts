import Airtable from 'airtable';
import type { Image } from '../../../types/gallery';
import { mapAirtableRecordToImage } from '../utils/imageMapper';
import { logInfo, logError } from '../utils/logging';
import { AirtableError } from '../errors';

export class AirtableService {
  private base: Airtable.Base;
  private table: Airtable.Table<any>;

  constructor(apiKey: string, baseId: string, tableName: string) {
    Airtable.configure({ apiKey });
    this.base = new Airtable().base(baseId);
    this.table = this.base(tableName);
  }

  async getImages(authorizedIds?: string[]): Promise<Image[]> {
    try {
      logInfo('AirtableService', 'Fetching images', {
        hasAuthorizedIds: !!authorizedIds,
        authorizedCount: authorizedIds?.length
      });

      if (!authorizedIds?.length) {
        logInfo('AirtableService', 'No authorized image IDs provided');
        return [];
      }

      const filterFormula = `OR(${authorizedIds.map(id => `RECORD_ID()='${id}'`).join(',')})`;

      const records = await this.table.select({
        maxRecords: 100,
        view: 'Grid view',
        sort: [{ field: 'Title', direction: 'asc' }],
        filterByFormula: filterFormula
      }).all();

      logInfo('AirtableService', `Fetched ${records.length} records`);

      const images = (await Promise.all(
        records.map(mapAirtableRecordToImage)
      )).filter((image): image is Image => image !== null);

      logInfo('AirtableService', 'Processed images', {
        total: images.length,
        withMetadata: images.filter(img => !!img.metadata).length,
        withExpiredRights: images.filter(img => img.rights.isExpired).length
      });

      return images;
    } catch (error) {
      logError('AirtableService', 'Failed to fetch images', error);
      throw new AirtableError('Failed to fetch images');
    }
  }
}