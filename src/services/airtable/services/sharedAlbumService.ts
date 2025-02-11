import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { logInfo, logError } from '../utils/logging';
import { emailService } from '../../email/emailService';
import { generatePassword } from '../../../utils/password';
import type { SharedAlbum, CreateSharedAlbumData } from '../../../types/sharedAlbum';

export class SharedAlbumService {
  private base: Airtable.Base;
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 500;

  constructor() {
    try {
      Airtable.configure({ 
        apiKey: AIRTABLE_CONFIG.apiKey,
        endpointUrl: 'https://api.airtable.com',
        apiVersion: '0.1.0',
        noRetryIfRateLimited: true
      });
      this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
    } catch (error) {
      logError('SharedAlbumService', 'Failed to initialize service', error);
      throw new Error('Failed to initialize Airtable service');
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async withRetry<T>(operation: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate_limit') && attempt < this.MAX_RETRIES) {
        logInfo('SharedAlbumService', `Rate limited, retrying in ${this.RETRY_DELAY}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`);
        await this.sleep(this.RETRY_DELAY * Math.pow(2, attempt));
        return this.withRetry(operation, attempt + 1);
      }
      throw error;
    }
  }

  private formatDateForAirtable(date: Date): string {
    return date.toISOString();
  }

  async getUserAlbums(userId: string): Promise<SharedAlbum[]> {
    try {
      logInfo('SharedAlbumService', 'Fetching user albums', { userId });

      // Get all albums created by the user using RECORD_ID()
      const records = await this.withRetry(() =>
        this.base('Shared_Albums')
          .select({
            filterByFormula: `AND(
              RECORD_ID() = '${userId}',
              {created_by} = '${userId}'
            )`,
            sort: [{ field: 'created_at', direction: 'desc' }]
          })
          .all()
      );

      // Process each album to include recipients
      const albums = await Promise.all(records.map(async record => {
        // Get recipients for this album using RECORD_ID()
        const recipientRecords = await this.withRetry(() =>
          this.base('Album_Recipients')
            .select({
              filterByFormula: `RECORD_ID() = '${record.id}'`
            })
            .all()
        );

        const recipients = recipientRecords.map(recipientRecord => ({
          id: recipientRecord.id,
          albumId: record.id,
          email: recipientRecord.get('email') as string,
          sentAt: recipientRecord.get('sent_at') as string,
          lastAccessedAt: recipientRecord.get('last_accessed_at') as string || null,
          accessCount: recipientRecord.get('access_count') as number || 0
        }));

        return {
          id: record.id,
          title: record.get('title') as string,
          description: record.get('description') as string || '',
          password: record.get('password') as string,
          createdAt: record.get('created_at') as string,
          expiresAt: record.get('expires_at') as string,
          createdBy: (record.get('created_by') as string[])[0],
          status: record.get('status') as 'active' | 'expired',
          recipients
        };
      }));

      logInfo('SharedAlbumService', 'Successfully fetched user albums', {
        userId,
        albumCount: albums.length
      });

      return albums;
    } catch (error) {
      logError('SharedAlbumService', 'Failed to fetch user albums', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async deleteAlbum(albumId: string): Promise<void> {
    try {
      logInfo('SharedAlbumService', 'Deleting album', { albumId });

      // Delete all related records first
      const [recipientRecords, imageRecords] = await Promise.all([
        this.withRetry(() =>
          this.base('Album_Recipients')
            .select({
              filterByFormula: `RECORD_ID() = '${albumId}'`
            })
            .all()
        ),
        this.withRetry(() =>
          this.base('Album_Images')
            .select({
              filterByFormula: `RECORD_ID() = '${albumId}'`
            })
            .all()
        )
      ]);

      // Delete recipients and images
      await Promise.all([
        recipientRecords.length > 0 && this.base('Album_Recipients').destroy(recipientRecords.map(r => r.id)),
        imageRecords.length > 0 && this.base('Album_Images').destroy(imageRecords.map(r => r.id))
      ]);

      // Finally delete the album
      await this.base('Shared_Albums').destroy([albumId]);

      logInfo('SharedAlbumService', 'Album deleted successfully', { albumId });
    } catch (error) {
      logError('SharedAlbumService', 'Failed to delete album', error);
      throw new Error('Failed to delete album');
    }
  }

  async createSharedAlbum(data: CreateSharedAlbumData, userId: string): Promise<{ album: SharedAlbum; emailErrors?: string[] }> {
    try {
      logInfo('SharedAlbumService', 'Creating shared album', { userId });

      const password = generatePassword();
      const now = this.formatDateForAirtable(new Date());

      // Create album record first
      let albumRecord;
      try {
        [albumRecord] = await this.withRetry(() => 
          this.base('Shared_Albums').create([{
            fields: {
              title: data.title,
              description: data.description,
              password,
              created_at: now,
              expires_at: this.formatDateForAirtable(new Date(data.expiresAt)),
              created_by: [userId],
              status: 'active'
            }
          }])
        );

        if (!albumRecord || !albumRecord.id) {
          throw new Error('Failed to create album record');
        }
      } catch (error) {
        logError('SharedAlbumService', 'Failed to create album record', error);
        throw new Error('Failed to create album');
      }

      const albumId = albumRecord.id;

      // Add images using RECORD_ID() for linking
      try {
        await this.withRetry(() =>
          this.base('Album_Images').create(
            data.imageIds.map((imageId, index) => ({
              fields: {
                album_id: [albumId],
                image_id: [imageId],
                order: index + 1
              }
            }))
          )
        );
      } catch (error) {
        // Cleanup album if image association fails
        await this.base('Shared_Albums').destroy([albumId]);
        logError('SharedAlbumService', 'Failed to associate images', error);
        throw new Error('Failed to associate images with album');
      }

      // Add recipients
      try {
        await this.withRetry(() =>
          this.base('Album_Recipients').create(
            data.recipients.map(email => ({
              fields: {
                album_id: [albumId],
                email,
                sent_at: now,
                access_count: 0
              }
            }))
          )
        );
      } catch (error) {
        // Cleanup album and images if recipient creation fails
        await this.base('Album_Images').destroy(
          (await this.base('Album_Images')
            .select({ filterByFormula: `RECORD_ID() = '${albumId}'` })
            .all())
            .map(record => record.id)
        );
        await this.base('Shared_Albums').destroy([albumId]);
        logError('SharedAlbumService', 'Failed to add recipients', error);
        throw new Error('Failed to add recipients');
      }

      // Send invitation emails - but don't fail if emails fail
      const albumUrl = `${window.location.origin}/shared-albums/${albumId}`;
      const emailErrors: string[] = [];
      
      await Promise.allSettled(
        data.recipients.map(async email => {
          try {
            await emailService.sendSharedAlbumInvitation({
              to: email,
              albumTitle: data.title,
              description: data.description,
              password,
              expiresAt: data.expiresAt,
              albumUrl
            });
          } catch (error) {
            logError('SharedAlbumService', `Failed to send invitation email to ${email}`, error);
            emailErrors.push(email);
          }
        })
      );

      const album: SharedAlbum = {
        id: albumId,
        title: data.title,
        description: data.description,
        password,
        createdAt: now,
        expiresAt: data.expiresAt,
        createdBy: userId,
        status: 'active',
        recipients: data.recipients.map(email => ({
          id: '', // Will be populated when fetching
          albumId,
          email,
          sentAt: now,
          lastAccessedAt: null,
          accessCount: 0
        }))
      };

      return {
        album,
        emailErrors: emailErrors.length > 0 ? emailErrors : undefined
      };
    } catch (error) {
      logError('SharedAlbumService', 'Failed to create shared album', error);
      throw error;
    }
  }

  async getSharedAlbum(id: string, password: string): Promise<SharedAlbum | null> {
    try {
      logInfo('SharedAlbumService', 'Fetching shared album', { id });

      // Get album using RECORD_ID()
      const records = await this.withRetry(() =>
        this.base('Shared_Albums')
          .select({
            filterByFormula: `RECORD_ID() = '${id}'`
          })
          .firstPage()
      );

      if (records.length === 0) {
        logInfo('SharedAlbumService', 'Album not found', { id });
        return null;
      }

      const record = records[0];
      const storedPassword = record.get('password') as string;

      if (storedPassword !== password) {
        logInfo('SharedAlbumService', 'Invalid password attempt', { id });
        return null;
      }

      // Get recipients using RECORD_ID() for linking
      const recipientRecords = await this.withRetry(() =>
        this.base('Album_Recipients')
          .select({
            filterByFormula: `RECORD_ID() = '${id}'`
          })
          .all()
      );

      const recipients = recipientRecords.map(recipientRecord => ({
        id: recipientRecord.id,
        albumId: id,
        email: recipientRecord.get('email') as string,
        sentAt: recipientRecord.get('sent_at') as string,
        lastAccessedAt: recipientRecord.get('last_accessed_at') as string || null,
        accessCount: recipientRecord.get('access_count') as number || 0
      }));

      return {
        id: record.id,
        title: record.get('title') as string,
        description: record.get('description') as string || '',
        password: storedPassword,
        createdAt: record.get('created_at') as string,
        expiresAt: record.get('expires_at') as string,
        createdBy: (record.get('created_by') as string[])[0],
        status: record.get('status') as 'active' | 'expired',
        recipients
      };
    } catch (error) {
      logError('SharedAlbumService', 'Failed to get shared album', error);
      throw new Error('Failed to get shared album');
    }
  }

  async getAlbumImages(albumId: string): Promise<string[]> {
    try {
      logInfo('SharedAlbumService', 'Fetching album images', { albumId });

      // Get images using RECORD_ID() for linking
      const records = await this.withRetry(() =>
        this.base('Album_Images')
          .select({
            filterByFormula: `RECORD_ID() = '${albumId}'`,
            sort: [{ field: 'order', direction: 'asc' }]
          })
          .all()
      );

      // Get the URL from the "URL (from Album_Images)" field
      return records.map(record => record.get('URL (from Album_Images)') as string).filter(Boolean);
    } catch (error) {
      logError('SharedAlbumService', 'Failed to get album images', error);
      throw new Error('Failed to get album images');
    }
  }
}

export const sharedAlbumService = new SharedAlbumService();