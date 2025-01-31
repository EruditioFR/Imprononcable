import mailchimp from '@mailchimp/mailchimp_transactional';
import { MAILCHIMP_CONFIG } from '../../../../config/mailchimp';
import type { EmailOptions } from '../../types/email';
import { EmailError } from '../../types/email';
import { logEmailError, logEmailInfo } from '../../utils/logging';

export class MailchimpTransactionalClient {
  private static instance: MailchimpTransactionalClient;
  private client: ReturnType<typeof mailchimp>;

  private constructor() {
    this.client = mailchimp(MAILCHIMP_CONFIG.apiKey);
  }

  public static getInstance(): MailchimpTransactionalClient {
    if (!MailchimpTransactionalClient.instance) {
      MailchimpTransactionalClient.instance = new MailchimpTransactionalClient();
    }
    return MailchimpTransactionalClient.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      logEmailInfo('MailchimpTransactional', 'Sending email', {
        to: options.to.map(r => r.email),
        subject: options.subject
      });

      const message = {
        html: options.html,
        text: options.text,
        subject: options.subject,
        from_email: options.from.email,
        from_name: options.from.name,
        to: options.to.map(recipient => ({
          email: recipient.email,
          name: recipient.name,
          type: 'to'
        })),
        attachments: options.attachments?.map(attachment => ({
          name: attachment.name,
          content: attachment.content,
          type: attachment.type
        }))
      };

      const response = await this.client.messages.send({ message });
      
      if (!response?.[0]?.status || response[0].status === 'rejected') {
        throw new Error(`Email rejected: ${response?.[0]?.reject_reason || 'Unknown reason'}`);
      }

      logEmailInfo('MailchimpTransactional', 'Email sent successfully', {
        messageId: response[0]._id,
        status: response[0].status
      });
    } catch (error) {
      logEmailError('MailchimpTransactional', 'Failed to send email', error);
      throw new EmailError(
        'Failed to send email',
        error instanceof Error ? error : undefined
      );
    }
  }

  public async sendTemplate(options: EmailOptions): Promise<void> {
    if (!options.templateId) {
      throw new EmailError('Template ID is required');
    }

    try {
      logEmailInfo('MailchimpTransactional', 'Sending template email', {
        template: options.templateId,
        to: options.to.map(r => r.email)
      });

      const message = {
        template_name: options.templateId,
        template_content: [],
        message: {
          subject: options.subject,
          from_email: options.from.email,
          from_name: options.from.name,
          to: options.to.map(recipient => ({
            email: recipient.email,
            name: recipient.name,
            type: 'to'
          })),
          global_merge_vars: options.templateData 
            ? Object.entries(options.templateData).map(([name, content]) => ({
                name,
                content
              }))
            : undefined
        }
      };

      const response = await this.client.messages.sendTemplate(message);

      if (!response?.[0]?.status || response[0].status === 'rejected') {
        throw new Error(`Template email rejected: ${response?.[0]?.reject_reason || 'Unknown reason'}`);
      }

      logEmailInfo('MailchimpTransactional', 'Template email sent successfully', {
        messageId: response[0]._id,
        status: response[0].status
      });
    } catch (error) {
      logEmailError('MailchimpTransactional', 'Failed to send template email', error);
      throw new EmailError(
        'Failed to send template email',
        error instanceof Error ? error : undefined
      );
    }
  }
}