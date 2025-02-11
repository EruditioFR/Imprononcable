import { GmailClient } from './client';
import type { EmailProvider, EmailMessage } from '../../types';
import { logEmailInfo } from '../../utils/logging';

export class GmailProvider implements EmailProvider {
  private client: GmailClient;

  constructor() {
    this.client = GmailClient.getInstance();
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    logEmailInfo('GmailProvider', 'Sending email', {
      to: message.to.email,
      subject: message.subject
    });

    await this.client.sendEmail({
      to: [{ email: message.to.email, name: message.to.name }],
      subject: message.subject,
      html: message.htmlContent
    });
  }
}