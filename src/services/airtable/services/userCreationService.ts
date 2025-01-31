import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import type { UserFormData } from '../../../types/user';

export class UserCreationService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    try {
      const records = await this.base(AIRTABLE_CONFIG.tables.users)
        .select({
          filterByFormula: `{Adresse mail} = '${email}'`,
          maxRecords: 1
        })
        .firstPage();
      
      return records.length > 0;
    } catch (error) {
      logError('UserCreationService', 'Failed to check email existence', error);
      throw new AirtableError('Impossible de vérifier l\'adresse email');
    }
  }

  async createUser(data: UserFormData): Promise<void> {
    try {
      logInfo('UserCreationService', 'Creating new user', { email: data.email });

      // Check if email already exists
      const emailExists = await this.checkEmailExists(data.email);
      if (emailExists) {
        throw new AirtableError('Cette adresse email est déjà utilisée');
      }

      await this.base(AIRTABLE_CONFIG.tables.users).create([
        {
          fields: {
            'Nom': data.nom,
            'Prenom': data.prenom,
            'Adresse mail': data.email,
            'Client': [data.client],
            'Niveau de droits': data.role,
            'Mot de passe': data.password,
            'Status': 'Actif'
          }
        }
      ]);

      logInfo('UserCreationService', 'User created successfully');
    } catch (error) {
      logError('UserCreationService', 'Failed to create user', error);
      if (error instanceof AirtableError) {
        throw error;
      }
      throw new AirtableError('Impossible de créer l\'utilisateur');
    }
  }
}

export const userCreationService = new UserCreationService();