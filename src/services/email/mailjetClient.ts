import { EMAIL_CONFIG } from './config';
import type { EmailMessage } from './types';
import { EmailError } from './types';

export class MailjetClient {
  private readonly API_URL = 'https://api.mailjet.com/v3.1/send';

  private getAuthHeader(): string {
    const credentials = `${EMAIL_CONFIG.mailjet.apiKey}:${EMAIL_CONFIG.mailjet.apiSecret}`;
    return `Basic ${btoa(credentials)}`;
  }

  public async sendEmail(message: EmailMessage): Promise<void> {
    if (!EMAIL_CONFIG.mailjet.apiKey || !EMAIL_CONFIG.mailjet.apiSecret) {
      throw new EmailError('Mailjet API credentials are missing');
    }

    const payload = {
      Messages: [{
        From: {
          Email: message.from.email,
          Name: message.from.name
        },
        To: [{
          Email: message.to.email,
          Name: message.to.name
        }],
        Subject: message.subject,
        HTMLPart: message.htmlContent
      }]
    };

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Mailjet API error:', data);
        throw new EmailError('Failed to send email through Mailjet');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new EmailError('Failed to send email. Please try again later.');
    }
  }
}