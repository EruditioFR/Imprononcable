import mailchimp from '@mailchimp/mailchimp_transactional';
import type { EmailOptions } from '../../types/email';
import { EmailError } from '../../types/email';
import { logEmailError, logEmailInfo } from '../../utils/logging';

export class MailchimpTransactionalClient {
  private static instance: MailchimpTransactionalClient;
  private client: ReturnType<typeof mailchimp>;
  private initialized: boolean = false;
  private readonly fromEmail = 'sending@veni6445.odns.fr';
  private readonly fromName = 'CollabSpace';

  private constructor() {
    // Check for API key in environment variables
    const apiKey = import.meta.env.VITE_MAILCHIMP_API_KEY;
    if (!apiKey) {
      throw new EmailError('Mailchimp API key is not configured');
    }
    this.client = mailchimp(apiKey);
  }

  public static getInstance(): MailchimpTransactionalClient {
    if (!MailchimpTransactionalClient.instance) {
      MailchimpTransactionalClient.instance = new MailchimpTransactionalClient();
    }
    return MailchimpTransactionalClient.instance;
  }

  private async validateConnection(): Promise<void> {
    if (this.initialized) return;

    try {
      const response = await this.client.users.ping();
      if (response.status !== 'success') {
        throw new Error('Failed to connect to Mailchimp');
      }
      this.initialized = true;
      logEmailInfo('MailchimpTransactional', 'Successfully connected to Mailchimp');
    } catch (error) {
      logEmailError('MailchimpTransactional', 'Failed to connect to Mailchimp', error);
      throw new EmailError(
        'Failed to connect to Mailchimp',
        error instanceof Error ? error : undefined
      );
    }
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.validateConnection();

      logEmailInfo('MailchimpTransactional', 'Sending email', {
        to: options.to.map(r => r.email),
        subject: options.subject
      });

      const message = {
        html: options.html,
        text: options.text || this.stripHtml(options.html),
        subject: options.subject,
        from_email: this.fromEmail,
        from_name: this.fromName,
        to: options.to.map(recipient => ({
          email: recipient.email,
          name: recipient.name,
          type: 'to'
        })),
        track_opens: true,
        track_clicks: true,
        important: true,
        attachments: options.attachments?.map(attachment => ({
          name: attachment.name,
          content: attachment.content,
          type: attachment.type
        }))
      };

      const [response] = await this.client.messages.send({ message });
      
      if (!response || response.status === 'rejected') {
        throw new Error(response?.reject_reason || 'Email rejected');
      }

      logEmailInfo('MailchimpTransactional', 'Email sent successfully', {
        messageId: response._id,
        status: response.status
      });
    } catch (error) {
      logEmailError('MailchimpTransactional', 'Failed to send email', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new EmailError('Invalid API key configuration');
        }
        if (error.message.includes('rejected')) {
          throw new EmailError('Email was rejected by the server');
        }
        if (error.message.includes('rate_limit')) {
          throw new EmailError('Rate limit exceeded, please try again later');
        }
      }
      
      throw new EmailError(
        'Failed to send email',
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