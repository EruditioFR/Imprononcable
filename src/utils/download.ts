import JSZip from 'jszip';
import { Image } from '../types/gallery';

function convertDropboxUrl(url: string): string {
  // Si l'URL est vide ou invalide
  if (!url) {
    throw new Error('URL is empty or invalid');
  }

  try {
    const urlObj = new URL(url);
    
    // Si c'est déjà une URL dl.dropboxusercontent.com, la retourner telle quelle
    if (urlObj.hostname === 'dl.dropboxusercontent.com') {
      return url;
    }

    // Convertir les URLs www.dropbox.com
    if (urlObj.hostname === 'www.dropbox.com') {
      // Conserver les paramètres d'URL existants
      const params = new URLSearchParams(urlObj.search);
      params.delete('dl'); // Supprimer dl=0/1 s'il existe
      
      // Construire la nouvelle URL
      const newUrl = new URL(url);
      newUrl.hostname = 'dl.dropboxusercontent.com';
      newUrl.search = params.toString();
      
      // Ajouter raw=1
      const finalParams = new URLSearchParams(newUrl.search);
      finalParams.set('raw', '1');
      newUrl.search = finalParams.toString();
      
      return newUrl.toString();
    }

    // Si ce n'est pas une URL Dropbox, retourner l'URL d'origine
    return url;
  } catch (error) {
    console.error('Error converting Dropbox URL:', error);
    return url;
  }
}

export async function downloadImage(url: string, filename: string) {
  try {
    console.log('Starting download:', { url, filename });
    
    const downloadUrl = convertDropboxUrl(url);
    console.log('Using download URL:', downloadUrl);
    
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*'
      },
      credentials: 'omit' // Important pour Dropbox
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Invalid content type received');
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Received empty file');
    }

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    
    console.log('Download completed successfully');
  } catch (error) {
    console.error('Failed to download image:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new Error(`Failed to download ${filename}`);
  }
}

async function fetchWithTimeout(url: string, timeout = 30000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const downloadUrl = convertDropboxUrl(url);
    const response = await fetch(downloadUrl, { 
      signal: controller.signal,
      headers: {
        'Accept': 'image/*'
      },
      credentials: 'omit'
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchImageWithRetry(url: string, retries = 3): Promise<Blob> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to fetch image:`, { url });
      
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Invalid content type received');
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Received empty blob');
      }
      
      return blob;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to fetch image');
      console.warn(`Attempt ${i + 1} failed:`, { error: lastError.message });
      
      if (i < retries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch image after retries');
}

export async function downloadImages(images: Image[], onProgress?: (progress: number) => void): Promise<number> {
  if (images.length === 0) {
    throw new Error('No images selected for download');
  }

  const zip = new JSZip();
  let successCount = 0;
  const total = images.length;
  const chunkSize = 2; // Reduced concurrent downloads to avoid rate limiting
  
  try {
    for (let i = 0; i < images.length; i += chunkSize) {
      const chunk = images.slice(i, i + chunkSize);
      
      const chunkPromises = chunk.map(async (image) => {
        try {
          const blob = await fetchImageWithRetry(image.thumbnailUrl || image.url);
          const filename = `${image.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
          zip.file(filename, blob, { compression: 'STORE' });
          successCount++;
          
          if (onProgress) {
            onProgress((successCount / total) * 90);
          }
        } catch (error) {
          console.error(`Failed to process ${image.title}:`, error);
        }
      });
      
      await Promise.all(chunkPromises);
      
      // Petit délai entre les chunks pour éviter le rate limiting
      if (i + chunkSize < images.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (successCount === 0) {
      throw new Error('No images were successfully processed');
    }

    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 1 }
    }, (metadata) => {
      if (onProgress) {
        onProgress(90 + (metadata.percent * 0.1));
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `images-${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);

    return successCount;
  } catch (error) {
    console.error('Failed to create zip file:', error);
    throw new Error('Failed to create zip file');
  }
}