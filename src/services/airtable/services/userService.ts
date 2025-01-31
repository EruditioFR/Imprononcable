import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import type { User, UserFormData } from '../../../types/user';
import type { Client } from '../../../types/client';

export class UserService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  async getClientNames(): Promise<Client[]> {
    try {
      logInfo('UserService', 'Fetching clients from Clients table');
      
      // Get records from the Clients table
      const records = await this.base('Clients').select().all();

      // Map records to Client objects
      const clients = records
        .map(record => {
          const id = record.get('ID');
          const name = record.get('Name');
          
          if (!id || !name || typeof id !== 'string' || typeof name !== 'string') {
            console.warn('Invalid client record:', { id, name });
            return null;
          }
          
          return { id, name };
        })
        .filter((client): client is Client => client !== null)
        .sort((a, b) => a.name.localeCompare(b.name));

      logInfo('UserService', 'Clients fetched successfully', {
        count: clients.length
      });

      return clients;
    } catch (error) {
      logError('UserService', 'Failed to fetch clients', error);
      throw new AirtableError('Impossible de récupérer la liste des clients');
    }
  }

  async getAuthorizedImageIds(userId: string): Promise<string[]> {
    try {
      logInfo('UserService', 'Fetching authorized image IDs', { userId });
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

  async refreshUserAuthorizations(user: User): Promise<User> {
    try {
      logInfo('UserService', 'Refreshing user authorizations', { userId: user.id });
      
      // Get the user record to get fresh data
      const record = await this.base(AIRTABLE_CONFIG.tables.users).find(user.id);
      
      // Get authorized image IDs
      const authorizedImageIds = record.get('Banque_image') as string[] || [];
      
      // Get client information
      const client = record.get('Client');
      
      // Return updated user object
      return {
        ...user,
        authorizedImageIds,
        client: client || undefined
      };
    } catch (error) {
      logError('UserService', 'Failed to refresh user authorizations', error);
      throw new AirtableError('Failed to refresh user authorizations');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      logInfo('UserService', 'Fetching users');
      const records = await this.base(AIRTABLE_CONFIG.tables.users).select().all();

      return records.map(record => ({
        id: record.id,
        email: record.get('Adresse mail') as string,
        prenom: record.get('Prenom') as string,
        nom: record.get('Nom') as string,
        client: record.get('Client') as string | string[],
        role: record.get('Niveau de droits') as 'Administrateur' | 'Utilisateur',
        status: record.get('Status') as string,
        authorizedImageIds: record.get('Banque_image') as string[] || []
      }));
    } catch (error) {
      logError('UserService', 'Failed to fetch users', error);
      throw new AirtableError('Impossible de récupérer les utilisateurs');
    }
  }
}

export const userService = new UserService();