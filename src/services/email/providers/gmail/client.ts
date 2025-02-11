import nodemailer from 'nodemailer';
import { EmailOptions } from '../../types/email';
import { EmailError } from '../../errors';
import { logEmailInfo, logEmailError } from '../../utils/logging';

export class GmailClient {
  private static instance: GmailClient;
  private transporter: nodemailer.Transporter;

  private constructor() {
    // Récupérer les identifiants depuis les variables d'environnement
    const email = import.meta.env.VITE_GMAIL_EMAIL;
    const appPassword = import.meta.env.VITE_GMAIL_APP_PASSWORD;

    if (!email || !appPassword) {
      throw new EmailError('Gmail credentials are missing. Please check your environment variables.');
    }

    // Créer le transporteur SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: appPassword // Utiliser un mot de passe d'application Gmail
      }
    });
  }

  public static getInstance(): GmailClient {
    if (!GmailClient.instance) {
      GmailClient.instance = new GmailClient();
    }
    return GmailClient.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      logEmailInfo('GmailClient', 'Sending email', {
        to: options.to.map(r => r.email),
        subject: options.subject
      });

      const mailOptions = {
        from: {
          name: 'CollabSpace',
          address: import.meta.env.VITE_GMAIL_EMAIL
        },
        to: options.to.map(recipient => ({
          name: recipient.name,
          address: recipient.email
        })),
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
        attachments: options.attachments
      };

      await this.transporter.sendMail(mailOptions);

      logEmailInfo('GmailClient', 'Email sent successfully');
    } catch (error) {
      logEmailError('GmailClient', 'Failed to send email', error);
      throw new EmailError(
        'Failed to send email. Please check your Gmail configuration.',
        error instanceof Error ? error : undefined
      );
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}