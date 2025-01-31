import EXIF from 'exif-js';

export class ExifService {
  async extractArtist(imageUrl: string): Promise<string | null> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        
        img.onload = function() {
          EXIF.getData(img as any, function(this: any) {
            const artist = EXIF.getTag(this, 'Artist');
            URL.revokeObjectURL(img.src);
            resolve(artist || null);
          });
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Failed to extract artist from image:', error);
      return null;
    }
  }
}

export const exifService = new ExifService();