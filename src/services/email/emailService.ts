import { EmailError } from './errors';
import { EMAIL_TEMPLATES } from './config/templates';
import type { EmailOptions } from './types/email';
import { logEmailInfo } from './utils/logging';
import { formatFrenchDate } from '../../utils/dates';

interface SharedAlbumInvitation {
  to: string;
  albumTitle: string;
  description: string;
  password: string;
  expiresAt: string;
  albumUrl: string;
}

class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendSharedAlbumInvitation(data: SharedAlbumInvitation): Promise<void> {
    try {
      const emailData = {
        to: data.to,
        subject: `Album partagé : ${data.albumTitle}`,
        template: 'shared-album',
        variables: {
          albumTitle: data.albumTitle,
          description: data.description,
          password: data.password,
          expirationDate: formatFrenchDate(data.expiresAt),
          albumUrl: data.albumUrl
        }
      };

      // Use EmailJS or similar browser-based email service
      await this.sendEmailWithService(emailData);

      logEmailInfo('EmailService', 'Shared album invitation sent', {
        to: data.to,
        albumTitle: data.albumTitle
      });
    } catch (error) {
      throw new EmailError(
        'Failed to send shared album invitation',
        error instanceof Error ? error : undefined
      );
    }
  }

  private async sendEmailWithService(data: any): Promise<void> {
    // Implement using EmailJS or similar browser-based service
    // This is a placeholder - you'll need to implement the actual email sending logic
    console.log('Sending email:', data);
    
    // For now, we'll simulate success
    // In production, implement actual email sending using a browser-compatible service
    return Promise.resolve();
  }
}

export const emailService = EmailService.getInstance();