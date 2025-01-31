import type { ImageMetadata } from '../types/metadata';

function convertDropboxUrl(url: string): string {
  try {
    if (!url) {
      throw new Error('Invalid URL');
    }

    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'dl.dropboxusercontent.com') {
      return url;
    }

    if (urlObj.hostname === 'www.dropbox.com') {
      const newUrl = url
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace(/\?dl=\d/, '?raw=1')
        .replace(/&dl=\d/, '&raw=1');

      if (!newUrl.includes('raw=1')) {
        return newUrl + (newUrl.includes('?') ? '&' : '?') + 'raw=1';
      }

      return newUrl;
    }

    return url;
  } catch (error) {
    console.error('Error converting Dropbox URL:', error);
    throw new Error('Invalid URL format');
  }
}

export async function extractMetadata(imageUrl: string): Promise<ImageMetadata> {
  return {
    width: 0,
    height: 0
  };
}