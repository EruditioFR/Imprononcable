import { MailjetClient } from './client';
import type { EmailProvider, EmailMessage } from '../../types';

export class MailjetProvider implements EmailProvider {
  private client: MailjetClient;

  constructor() {
    this.client = new MailjetClient();
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    await this.client.sendEmail(message);
  }
}