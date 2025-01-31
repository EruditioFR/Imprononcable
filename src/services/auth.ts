import Airtable from 'airtable';
import type { User, LoginFormData, ChangePasswordFormData, UserRole } from '../types/auth';

const USERS_TABLE = 'Users';

export class AuthService {
  private base: Airtable.Base;

  constructor(apiKey: string, baseId: string) {
    Airtable.configure({ apiKey });
    this.base = new Airtable().base(baseId);
  }

  async login({ email, password }: LoginFormData): Promise<User> {
    try {
      const records = await this.base(USERS_TABLE)
        .select({
          filterByFormula: `AND({Adresse mail} = '${email}', {Mot de passe} = '${password}')`
        })
        .firstPage();

      if (records.length === 0) {
        throw new Error('Identifiants invalides');
      }

      const userRecord = records[0];
      const authorizedImageIds = await this.getAuthorizedImageIds(userRecord);
      const role = userRecord.get('Niveau de droits') as UserRole;

      if (!role || !['Administrateur', 'Utilisateur', 'Presse'].includes(role)) {
        throw new Error('Rôle utilisateur invalide');
      }

      return {
        id: userRecord.id,
        email: userRecord.get('Adresse mail') as string,
        prenom: userRecord.get('Prenom') as string,
        client: userRecord.get('Client')?.[0] as string,
        role,
        authorizedImageIds
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Échec de la connexion');
    }
  }

  private async getAuthorizedImageIds(record: any): Promise<string[]> {
    try {
      const banqueImages = record.get('Banque_image');
      if (!banqueImages || !Array.isArray(banqueImages)) {
        console.warn('No authorized images found for user:', record.id);
        return [];
      }
      return banqueImages;
    } catch (error) {
      console.error('Failed to get authorized images:', error);
      return [];
    }
  }

  async changePassword(userId: string, { currentPassword, newPassword }: ChangePasswordFormData): Promise<void> {
    try {
      const user = await this.base(USERS_TABLE).find(userId);
      if (user.get('Mot de passe') !== currentPassword) {
        throw new Error('Mot de passe actuel incorrect');
      }

      await this.base(USERS_TABLE).update(userId, {
        'Mot de passe': newPassword
      });
    } catch (error) {
      console.error('Password change failed:', error);
      throw new Error('Échec du changement de mot de passe');
    }
  }
}