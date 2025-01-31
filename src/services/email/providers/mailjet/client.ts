import { getMailjetConfig } from './config';
import type { EmailMessage } from '../../types';
import { EmailError } from '../../errors';

export class MailjetClient {
  private readonly config = getMailjetConfig();

  private getAuthHeader(): string {
    return `Basic ${btoa(`${this.config.apiKey}:${this.config.apiSecret}`)}`;
  }

  public async sendEmail(message: EmailMessage): Promise<void> {
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
        HTMLPart: message.htmlContent,
        CustomID: "RightsRequest"
      }]
    };

    try {
      console.log('Sending email via Mailjet:', {
        from: message.from.email,
        to: message.to.email,
        subject: message.subject
      });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Mailjet API error:', {
          status: response.status,
          data
        });
        
        throw new EmailError(
          'Failed to send email through Mailjet',
          { status: response.status, data }
        );
      }

      console.log('Email sent successfully:', {
        messageId: data.Messages?.[0]?.To?.[0]?.MessageID,
        status: data.Messages?.[0]?.Status
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error instanceof EmailError 
        ? error 
        : new EmailError('Failed to send email. Please try again later.', error);
    }
  }
}