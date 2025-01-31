import { Dropbox } from 'dropbox';

// Get tokens from environment variables
const DROPBOX_ACCESS_TOKEN = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
const DROPBOX_REFRESH_TOKEN = import.meta.env.VITE_DROPBOX_REFRESH_TOKEN;
const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY;
const DROPBOX_APP_SECRET = import.meta.env.VITE_DROPBOX_APP_SECRET;

export class DropboxError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DropboxError';
  }
}

export class DropboxService {
  private client: Dropbox | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (!DROPBOX_ACCESS_TOKEN || !DROPBOX_APP_KEY || !DROPBOX_APP_SECRET) {
      throw new DropboxError('Missing Dropbox credentials. Please check your environment variables.');
    }

    try {
      this.client = new Dropbox({ 
        accessToken: DROPBOX_ACCESS_TOKEN,
        clientId: DROPBOX_APP_KEY,
        clientSecret: DROPBOX_APP_SECRET,
        refreshToken: DROPBOX_REFRESH_TOKEN
      });
    } catch (error) {
      console.error('Failed to initialize Dropbox client:', error);
      throw new DropboxError('Failed to initialize Dropbox client', error);
    }
  }

  private async refreshToken() {
    if (!this.client) {
      throw new DropboxError('Dropbox client not initialized');
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        console.log('Refreshing Dropbox access token...');
        const response = await this.client.refreshAccessToken();
        console.log('Token refresh successful');

        this.client = new Dropbox({ 
          accessToken: response.result.access_token,
          clientId: DROPBOX_APP_KEY,
          clientSecret: DROPBOX_APP_SECRET,
          refreshToken: DROPBOX_REFRESH_TOKEN
        });
      } catch (error) {
        console.error('Failed to refresh Dropbox token:', error);
        throw new DropboxError('Failed to refresh access token', error);
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (error?.status === 401 && retries > 0) {
        console.log('Access token expired, attempting refresh...');
        await this.refreshToken();
        return this.executeWithRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  async uploadFile(file: File, path: string): Promise<string> {
    if (!this.client) {
      throw new DropboxError('Dropbox client not initialized');
    }

    try {
      console.log('Starting Dropbox upload:', {
        fileName: file.name,
        path: path
      });

      const arrayBuffer = await file.arrayBuffer();
      
      // Upload file to Dropbox with retry on token expiration
      const response = await this.executeWithRetry(() => 
        this.client!.filesUpload({
          path: `/${path}/${file.name}`,
          contents: arrayBuffer,
          mode: { '.tag': 'overwrite' }
        })
      );

      console.log('File uploaded successfully:', {
        path: response.result.path_display
      });

      // Create a shared link with retry on token expiration
      const sharedLink = await this.executeWithRetry(() =>
        this.client!.sharingCreateSharedLink({
          path: response.result.path_display || ''
        })
      );

      // Convert to direct download link
      const directLink = sharedLink.result.url
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace('?dl=0', '?raw=1');

      console.log('Generated direct download link:', directLink);

      return directLink;
    } catch (error) {
      console.error('Failed to upload to Dropbox:', error);
      throw new DropboxError('Failed to upload file to Dropbox', error);
    }
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.client) {
      throw new DropboxError('Dropbox client not initialized');
    }

    try {
      await this.executeWithRetry(() =>
        this.client!.filesDeleteV2({
          path: `/${path}`
        })
      );
    } catch (error) {
      console.error('Failed to delete file from Dropbox:', error);
      throw new DropboxError('Failed to delete file from Dropbox', error);
    }
  }

  async listFiles(path: string = ''): Promise<string[]> {
    if (!this.client) {
      throw new DropboxError('Dropbox client not initialized');
    }

    try {
      const response = await this.executeWithRetry(() =>
        this.client!.filesListFolder({
          path: `/${path}`
        })
      );

      return response.result.entries.map(entry => entry.path_display || '');
    } catch (error) {
      console.error('Failed to list files from Dropbox:', error);
      throw new DropboxError('Failed to list files from Dropbox', error);
    }
  }
}

export const dropboxService = new DropboxService();