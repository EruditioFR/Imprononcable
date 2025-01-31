import { exifService } from '../exif/exifService';

interface ExifModuleInput {
  imageUrl: string;
}

interface ExifModuleOutput {
  artist: string | null;
  error?: string;
}

export async function makeExifModule(input: ExifModuleInput): Promise<ExifModuleOutput> {
  try {
    if (!input.imageUrl) {
      throw new Error('Image URL is required');
    }

    const artist = await exifService.extractArtist(input.imageUrl);
    
    return {
      artist
    };
  } catch (error) {
    return {
      artist: null,
      error: error instanceof Error ? error.message : 'Failed to extract EXIF data'
    };
  }
}