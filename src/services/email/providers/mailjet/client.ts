import type { EmailOptions } from '../../types/email';
import { EmailError } from '../../errors';
import { logEmailInfo, logEmailError } from '../../utils/logging';

export class MailjetClient {
  private static instance: MailjetClient;
  private readonly API_URL = 'https://api.mailjet.com/v3.1/send';
  private readonly fromEmail = 'contact@coachwp.fr';
  private readonly fromName = 'CollabSpace';
  private credentials: string;

  private constructor() {
    const apiKey = import.meta.env.VITE_MAILJET_API_KEY;
    const apiSecret = import.meta.env.VITE_MAILJET_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new EmailError('Mailjet API credentials are missing. Please check your environment variables: VITE_MAILJET_API_KEY and VITE_MAILJET_API_SECRET');
    }

    this.credentials = btoa(`${apiKey}:${apiSecret}`);
  }

  public static getInstance(): MailjetClient {
    if (!MailjetClient.instance) {
      MailjetClient.instance = new MailjetClient();
    }
    return MailjetClient.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      logEmailInfo('MailjetClient', 'Preparing to send email', {
        from: this.fromEmail,
        to: options.to.map(r => r.email),
        subject: options.subject
      });

      const payload = {
        Messages: [{
          From: {
            Email: this.fromEmail,
            Name: this.fromName
          },
          To: options.to.map(recipient => ({
            Email: recipient.email,
            Name: recipient.name || ''
          })),
          Subject: options.subject,
          HTMLPart: options.html,
          TextPart: options.text || this.stripHtml(options.html),
          CustomID: "CollabSpace_Email"
        }]
      };

      logEmailInfo('MailjetClient', 'Sending request to Mailjet API', {
        url: this.API_URL,
        payload: {
          ...payload,
          Messages: payload.Messages.map(msg => ({
            ...msg,
            From: { ...msg.From },
            To: msg.To.map(to => ({ ...to }))
          }))
        }
      });

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.credentials}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      logEmailInfo('MailjetClient', 'Received response from Mailjet API', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });

      if (!response.ok) {
        logEmailError('MailjetClient', 'API error response', {
          status: response.status,
          data
        });
        
        // More specific error messages based on status codes
        if (response.status === 401) {
          throw new EmailError('Invalid Mailjet API credentials. Please check your API key and secret.', data);
        }
        if (response.status === 403) {
          throw new EmailError('Access forbidden. Please verify your Mailjet account permissions.', data);
        }
        if (response.status === 429) {
          throw new EmailError('Rate limit exceeded. Please try again later.', data);
        }
        
        throw new EmailError(
          data.ErrorMessage || data.message || 'Failed to send email',
          { response: data, status: response.status }
        );
      }

      logEmailInfo('MailjetClient', 'Email sent successfully', {
        messageId: data.Messages?.[0]?.To?.[0]?.MessageID,
        status: data.Messages?.[0]?.Status
      });
    } catch (error) {
      logEmailError('MailjetClient', 'Failed to send email', error);
      
      if (error instanceof EmailError) {
        throw error;
      }
      
      throw new EmailError(
        'Failed to send email. Please check your Mailjet configuration and try again.',
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