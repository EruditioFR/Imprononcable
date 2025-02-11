import type { EmailOptions } from '../../types/email';
import { EmailError } from '../../errors';
import { logEmailInfo, logEmailError } from '../../utils/logging';

export class SmtpClient {
  private static instance: SmtpClient;
  private readonly API_URL: string;
  private readonly fromEmail: string;
  private readonly fromName = 'CollabSpace';

  private constructor() {
    // Utiliser l'URL de base du site en production
    this.API_URL = `${window.location.origin}/send-email.php`;
    this.fromEmail = 'contact@coachwp.fr'; // Remplacez par votre email O2switch
  }

  public static getInstance(): SmtpClient {
    if (!SmtpClient.instance) {
      SmtpClient.instance = new SmtpClient();
    }
    return SmtpClient.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      logEmailInfo('SmtpClient', 'Sending email', {
        to: options.to.map(r => r.email),
        subject: options.subject
      });

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || this.stripHtml(options.html)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `SMTP error: ${response.statusText}`);
      }

      logEmailInfo('SmtpClient', 'Email sent successfully');
    } catch (error) {
      logEmailError('SmtpClient', 'Failed to send email', error);
      throw new EmailError('Failed to send email', error instanceof Error ? error : undefined);
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const smtpClient = SmtpClient.getInstance();