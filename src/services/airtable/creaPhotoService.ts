import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from './config';

export class CreaPhotoService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  async getCreaPhotoContent(clientId: string): Promise<string | null> {
    try {
      console.log('Fetching Crea Photo content for client:', clientId);
      
      const records = await this.base(AIRTABLE_CONFIG.tables.creaPhoto)
        .select({
          filterByFormula: `{Client} = '${clientId}'`,
          maxRecords: 1
        })
        .firstPage();

      if (records.length === 0) {
        console.warn('No Crea Photo content found for client:', clientId);
        return null;
      }

      const content = records[0].get('Crea Photo') as string;
      console.log('Content fetched successfully for client:', clientId);
      
      return content || null;
    } catch (error) {
      console.error('Failed to fetch Crea Photo content:', error);
      throw new Error('Failed to load content');
    }
  }
}