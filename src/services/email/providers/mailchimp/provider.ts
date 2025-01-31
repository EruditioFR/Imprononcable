import { MailchimpClient } from './client';
import type { EmailProvider, EmailMessage } from '../../types';
import { logEmailInfo } from '../../utils/logging';

export class MailchimpProvider implements EmailProvider {
  private client: MailchimpClient;

  constructor() {
    this.client = MailchimpClient.getInstance();
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    logEmailInfo('MailchimpProvider', 'Sending email', {
      to: message.to.email,
      subject: message.subject
    });

    // For transactional emails, we'll use a template
    await this.client.sendTransactionalEmail(
      'default-template',
      message.to.email,
      message.subject,
      {
        CONTENT: message.htmlContent
      }
    );
  }

  async validateConnection(): Promise<boolean> {
    return this.client.ping();
  }
}