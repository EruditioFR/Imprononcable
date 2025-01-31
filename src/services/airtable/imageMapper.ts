import type { Image } from '../../types/gallery';
import type { AirtableRecord } from './types';
import { checkImageRights } from '../../utils/rights';

export async function mapAirtableRecordToImage(record: AirtableRecord): Promise<Image | null> {
  try {
    const title = record.get('Nom image') as string;
    const hdUrl = record.get('url drpbx HD') as string;
    const thumbnailUrl = record.get('url drpbx miniatures') as string;
    
    if (!thumbnailUrl || !title) {
      console.warn('Skipping record due to missing required fields:', {
        id: record.id,
        hasThumbnail: !!thumbnailUrl,
        hasTitle: !!title,
      });
      return null;
    }

    const startDate = record.get('debut_droits') as string;
    const endDate = record.get('fin_droits') as string;
    
    return {
      id: record.id,
      title,
      url: hdUrl || thumbnailUrl,
      thumbnailUrl,
      categories: record.get('Categories') as string[] || [],
      tags: record.get('Tags') as string[] || [],
      "tags proposés": record.get('tags proposés') as string, // Changed to string
      client: (record.get('Client') as string[])?.[0] || '',
      description: record.get('Description') as string,
      author: record.get('Auteur') as string,
      width: 1200,
      height: 800,
      rights: {
        startDate,
        endDate,
        isExpired: !checkImageRights(startDate, endDate)
      }
    };
  } catch (error) {
    console.error('Failed to map Airtable record to image:', {
      recordId: record.id,
      error
    });
    return null;
  }
}