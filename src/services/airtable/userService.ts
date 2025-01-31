import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from './config';
import type { User } from '../../types/auth';
import { AirtableError } from './errors';
import { logInfo, logError } from './utils/logging';

export class UserService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  async getAuthorizedImageIds(userId: string): Promise<string[]> {
    try {
      logInfo('UserService', 'Fetching authorized images', { userId });
      const record = await this.base(AIRTABLE_CONFIG.tables.users).find(userId);
      const banqueImages = record.get('Banque_image');

      if (!banqueImages || !Array.isArray(banqueImages)) {
        logInfo('UserService', 'No authorized images found', { userId });
        return [];
      }

      return banqueImages;
    } catch (error) {
      logError('UserService', 'Failed to get authorized images', error);
      throw new AirtableError('Failed to retrieve authorized images');
    }
  }

  async getUserClient(userId: string): Promise<string | null> {
    try {
      logInfo('UserService', 'Fetching user client', { userId });
      const record = await this.base(AIRTABLE_CONFIG.tables.users).find(userId);
      return record.get('Client') as string || null;
    } catch (error) {
      logError('UserService', 'Failed to get user client', error);
      return null;
    }
  }

  async refreshUserAuthorizations(user: User): Promise<User> {
    logInfo('UserService', 'Refreshing user authorizations', { userId: user.id });
    const [authorizedImageIds, client] = await Promise.all([
      this.getAuthorizedImageIds(user.id),
      this.getUserClient(user.id)
    ]);

    return {
      ...user,
      authorizedImageIds,
      client
    };
  }
}