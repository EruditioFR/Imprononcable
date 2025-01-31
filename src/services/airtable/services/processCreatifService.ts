import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import { format, parse, isValid } from 'date-fns';
import { dropboxService } from '../../dropbox/dropboxService';
import type { ProcessCreatif, ProcessCreatifFormData } from '../../../types/processCreatif';

export class ProcessCreatifService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  private async uploadImageToDropbox(file: File): Promise<string> {
    try {
      const dropboxPath = 'ressources-images';
      const imageUrl = await dropboxService.uploadFile(file, dropboxPath);
      logInfo('ProcessCreatifService', 'Image uploaded successfully', { imageUrl });
      return imageUrl;
    } catch (error) {
      logError('ProcessCreatifService', 'Image upload failed', error);
      throw new AirtableError('Failed to upload image');
    }
  }

  private convertToISODate(frenchDate: string): string {
    try {
      const parsedDate = parse(frenchDate, 'dd/MM/yyyy', new Date());
      
      if (!isValid(parsedDate)) {
        throw new Error('Invalid date format');
      }
      
      return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    } catch (error) {
      throw new Error(`Invalid date format: ${frenchDate}. Expected format: dd/MM/yyyy`);
    }
  }

  async updateProcess(id: string, data: ProcessCreatifFormData): Promise<void> {
    try {
      logInfo('ProcessCreatifService', 'Starting resource update', { id });

      // Prepare base fields
      const fields: Record<string, any> = {
        'Titre': data.title,
        'Contenu': data.content,
        'Client': [data.client],
        'Date de publication': this.convertToISODate(data.publishedAt),
        'Status': 'published'
      };

      // Handle featured image
      if (data.featuredImage) {
        try {
          let imageUrl: string;
          
          if (data.featuredImage instanceof File) {
            logInfo('ProcessCreatifService', 'Uploading new image to Dropbox');
            imageUrl = await this.uploadImageToDropbox(data.featuredImage);
          } else {
            logInfo('ProcessCreatifService', 'Using existing image URL');
            imageUrl = data.featuredImage;
          }
          
          fields['image à la une'] = [{
            url: imageUrl
          }];
          
          logInfo('ProcessCreatifService', 'Image field prepared', { imageUrl });
        } catch (error) {
          logError('ProcessCreatifService', 'Failed to process image', error);
          throw new AirtableError('Failed to process image');
        }
      } else {
        fields['image à la une'] = null;
      }

      // Update record in Airtable
      logInfo('ProcessCreatifService', 'Updating Airtable record', { fields });
      
      await this.base(AIRTABLE_CONFIG.tables.creaPhoto).update([{
        id,
        fields
      }]);

      logInfo('ProcessCreatifService', 'Resource updated successfully');
    } catch (error) {
      logError('ProcessCreatifService', 'Failed to update resource', error);
      
      if (error instanceof AirtableError) {
        throw error;
      }
      
      throw new AirtableError('Failed to update resource');
    }
  }

  async getProcesses(): Promise<ProcessCreatif[]> {
    try {
      logInfo('ProcessCreatifService', 'Fetching processes');

      const records = await this.base(AIRTABLE_CONFIG.tables.creaPhoto)
        .select({
          filterByFormula: `{Status} = 'published'`,
          sort: [{ field: 'Date de publication', direction: 'desc' }]
        })
        .all();

      return records.map(record => ({
        id: record.id,
        title: record.get('Titre') as string || '',
        content: record.get('Contenu') as string || '',
        publishedAt: this.formatDateToFrench(record.get('Date de publication') as string),
        author: record.get('Nom et Prénom (from Auteur)') as string || '',
        client: record.get('Name (from Client)') as string || '',
        clientId: (record.get('Client') as string[])?.[0] || '',
        featuredImage: record.get('image à la une')?.[0]?.url as string || undefined
      }));
    } catch (error) {
      logError('ProcessCreatifService', 'Failed to fetch processes', error);
      throw new AirtableError('Failed to fetch resources');
    }
  }

  async getProcess(id: string): Promise<ProcessCreatif> {
    try {
      logInfo('ProcessCreatifService', 'Fetching process', { id });

      const record = await this.base(AIRTABLE_CONFIG.tables.creaPhoto).find(id);

      return {
        id: record.id,
        title: record.get('Titre') as string || '',
        content: record.get('Contenu') as string || '',
        publishedAt: this.formatDateToFrench(record.get('Date de publication') as string),
        author: record.get('Nom et Prénom (from Auteur)') as string || '',
        client: record.get('Name (from Client)') as string || '',
        clientId: (record.get('Client') as string[])?.[0] || '',
        featuredImage: record.get('image à la une')?.[0]?.url as string || undefined
      };
    } catch (error) {
      logError('ProcessCreatifService', 'Failed to fetch process', error);
      throw new AirtableError('Failed to fetch resource');
    }
  }

  private formatDateToFrench(isoDate: string | null | undefined): string {
    if (!isoDate) {
      return format(new Date(), 'dd/MM/yyyy');
    }
    try {
      const date = new Date(isoDate);
      if (!isValid(date)) {
        return format(new Date(), 'dd/MM/yyyy');
      }
      return format(date, 'dd/MM/yyyy');
    } catch {
      return format(new Date(), 'dd/MM/yyyy');
    }
  }

  async createProcess(data: ProcessCreatifFormData): Promise<void> {
    try {
      logInfo('ProcessCreatifService', 'Creating resource', data);

      const fields: Record<string, any> = {
        'Titre': data.title,
        'Contenu': data.content,
        'Client': [data.client],
        'Date de publication': this.convertToISODate(data.publishedAt),
        'Status': 'published',
        'Users': ['rec9wuK5kcwtjG4O1', 'recDefMKpOO0GIFsu']
      };

      // Handle featured image
      if (data.featuredImage instanceof File) {
        try {
          const imageUrl = await this.uploadImageToDropbox(data.featuredImage);
          fields['image à la une'] = [{ url: imageUrl }];
        } catch (error) {
          logError('ProcessCreatifService', 'Image upload failed', error);
          throw new AirtableError('Failed to upload image');
        }
      } else if (typeof data.featuredImage === 'string') {
        fields['image à la une'] = [{ url: data.featuredImage }];
      }

      await this.base(AIRTABLE_CONFIG.tables.creaPhoto).create([{ fields }]);
      logInfo('ProcessCreatifService', 'Resource created successfully');
    } catch (error) {
      logError('ProcessCreatifService', 'Failed to create resource', error);
      throw new AirtableError('Failed to create resource');
    }
  }

  async deleteProcess(id: string): Promise<void> {
    try {
      logInfo('ProcessCreatifService', 'Deleting process', { id });
      await this.base(AIRTABLE_CONFIG.tables.creaPhoto).destroy(id);
      logInfo('ProcessCreatifService', 'Process deleted successfully');
    } catch (error) {
      logError('ProcessCreatifService', 'Failed to delete process', error);
      throw new AirtableError('Failed to delete resource');
    }
  }
}

export const processCreatifService = new ProcessCreatifService();