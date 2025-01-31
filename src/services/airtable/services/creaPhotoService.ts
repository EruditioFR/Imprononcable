import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { logInfo, logError } from '../utils/logging';
import { AirtableError } from '../errors';
import { getFieldValue } from '../utils/records';

export class CreaPhotoService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  async getClients() {
    try {
      logInfo('CreaPhotoService', 'Fetching clients');

      const records = await this.base('Clients')
        .select({
          fields: ['Name', 'ID']
        })
        .all();

      const clients = records.map(record => ({
        id: record.id,
        name: record.get('Name') as string
      }));

      return clients.filter(client => client.name).sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    } catch (error) {
      logError('CreaPhotoService', 'Failed to fetch clients', error);
      throw new AirtableError('Impossible de récupérer la liste des clients');
    }
  }
}

export const creaPhotoService = new CreaPhotoService();