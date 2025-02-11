import { SmtpClient } from './providers/smtp/client';
import { EmailError } from './errors';
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
  private client: SmtpClient;

  private constructor() {
    this.client = SmtpClient.getInstance();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendSharedAlbumInvitation(data: SharedAlbumInvitation): Promise<void> {
    try {
      logEmailInfo('EmailService', 'Sending shared album invitation', {
        to: data.to,
        albumTitle: data.albumTitle
      });

      const emailOptions: EmailOptions = {
        to: [{ email: data.to }],
        subject: `Album partagé : ${data.albumTitle}`,
        html: this.generateSharedAlbumEmail(data),
        text: this.generateSharedAlbumText(data)
      };

      await this.client.sendEmail(emailOptions);
    } catch (error) {
      throw new EmailError(
        'Failed to send shared album invitation',
        error instanceof Error ? error : undefined
      );
    }
  }

  private generateSharedAlbumEmail(data: SharedAlbumInvitation): string {
    return `
      <h2>Un album photo a été partagé avec vous</h2>
      
      <div style="margin: 20px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0;">${data.albumTitle}</h3>
        ${data.description ? `<p style="margin: 0;">${data.description}</p>` : ''}
      </div>

      <p><strong>Mot de passe :</strong> ${data.password}</p>
      <p><strong>Date d'expiration :</strong> ${formatFrenchDate(data.expiresAt)}</p>

      <div style="margin: 30px 0;">
        <a href="${data.albumUrl}" 
           style="background: #055E4C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Voir l'album
        </a>
      </div>

      <p style="color: #666; font-size: 14px;">
        Cet album expirera le ${formatFrenchDate(data.expiresAt)}. Assurez-vous de télécharger les images avant cette date.
      </p>
    `;
  }

  private generateSharedAlbumText(data: SharedAlbumInvitation): string {
    return `
Un album photo a été partagé avec vous

${data.albumTitle}
${data.description ? `\n${data.description}` : ''}

Mot de passe : ${data.password}
Date d'expiration : ${formatFrenchDate(data.expiresAt)}

Pour voir l'album, visitez :
${data.albumUrl}

Cet album expirera le ${formatFrenchDate(data.expiresAt)}. Assurez-vous de télécharger les images avant cette date.
    `.trim();
  }
}

export const emailService = EmailService.getInstance();