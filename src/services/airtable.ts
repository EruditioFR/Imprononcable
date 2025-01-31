import Airtable from 'airtable';
import type { Image } from '../types/gallery';
import type { ImageMetadata } from '../types/metadata';
import { extractMetadata } from '../utils/metadata';
import { checkImageRights } from '../utils/rights';
import { UserService } from './airtable/services/userService';

interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
    full: { url: string; width: number; height: number };
  };
}

export class AirtableService {
  private base: Airtable.Base;
  private table: Airtable.Table<any>;

  constructor(apiKey: string, baseId: string, tableName: string) {
    Airtable.configure({ apiKey });
    this.base = new Airtable().base(baseId);
    this.table = this.base(tableName);
  }

  async getImages(): Promise<Image[]> {
    try {
      console.log('Fetching images from Airtable...');
      
      const records = await this.table.select({
        maxRecords: 100,
        view: 'Grid view',
        sort: [{ field: 'Title', direction: 'asc' }]
      }).all();

      console.log(`Successfully fetched ${records.length} records from Airtable`);

      const images = await Promise.all(
        records
          .filter(record => {
            const attachments = record.get('URL') as AirtableAttachment[];
            const hasAttachment = Array.isArray(attachments) && attachments.length > 0;
            const hasTitle = record.get('Title');
            
            if (!hasAttachment || !hasTitle) {
              console.warn('Skipping record due to missing required fields:', {
                id: record.id,
                hasAttachment: !!hasAttachment,
                hasTitle: !!hasTitle,
              });
              return false;
            }
            return true;
          })
          .map(async record => {
            const attachments = record.get('URL') as AirtableAttachment[];
            const firstAttachment = attachments[0];
            const imageUrl = firstAttachment.thumbnails?.full?.url || firstAttachment.url;
            const author = record.get('Author') as string;
            const startDate = record.get('debut_droits') as string;
            const endDate = record.get('fin_droits') as string;
            
            console.log('Processing image:', {
              id: record.id,
              title: record.get('Title'),
              author,
              url: imageUrl,
              rights: { startDate, endDate }
            });
            
            const metadata = await extractMetadata(imageUrl);
            metadata.author = author;
            
            const image: Image = {
              id: record.id,
              title: record.get('Title') as string,
              url: imageUrl,
              categories: record.get('Categories') as string[] || [],
              width: metadata.width || firstAttachment.thumbnails?.full?.width || 1200,
              height: metadata.height || firstAttachment.thumbnails?.full?.height || 800,
              metadata,
              rights: {
                startDate,
                endDate,
                isExpired: !checkImageRights(startDate, endDate)
              }
            };
            
            console.log('Processed image:', {
              id: image.id,
              title: image.title,
              hasMetadata: !!image.metadata,
              rights: image.rights
            });
            
            return image;
          })
      );

      console.log('Successfully processed all images:', {
        total: images.length,
        withMetadata: images.filter(img => !!img.metadata).length,
        withExpiredRights: images.filter(img => img.rights.isExpired).length
      });

      return images;
    } catch (error) {
      console.error('Failed to fetch images from Airtable:', error);
      throw error;
    }
  }
}

// Create and export singleton instance of UserService
export const userService = new UserService();