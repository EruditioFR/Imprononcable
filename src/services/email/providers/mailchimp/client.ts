import mailchimp from '@mailchimp/mailchimp_marketing';
import { MAILCHIMP_CONFIG } from '../../../../config/mailchimp';
import { EmailError } from '../../errors';
import { logEmailError, logEmailInfo } from '../../utils/logging';

export class MailchimpClient {
  private static instance: MailchimpClient;

  private constructor() {
    mailchimp.setConfig({
      apiKey: MAILCHIMP_CONFIG.apiKey,
      server: MAILCHIMP_CONFIG.serverPrefix
    });
  }

  public static getInstance(): MailchimpClient {
    if (!MailchimpClient.instance) {
      MailchimpClient.instance = new MailchimpClient();
    }
    return MailchimpClient.instance;
  }

  public async ping(): Promise<boolean> {
    try {
      const response = await mailchimp.ping.get();
      return response.health_status === "Everything's Chimpy!";
    } catch (error) {
      logEmailError('MailchimpClient', 'Ping failed', error);
      return false;
    }
  }

  public async addToList(email: string, fields: Record<string, any> = {}): Promise<void> {
    try {
      logEmailInfo('MailchimpClient', 'Adding subscriber to list', { email });

      await mailchimp.lists.addListMember(MAILCHIMP_CONFIG.listId, {
        email_address: email,
        status: 'subscribed',
        merge_fields: fields
      });

      logEmailInfo('MailchimpClient', 'Subscriber added successfully', { email });
    } catch (error) {
      logEmailError('MailchimpClient', 'Failed to add subscriber', error);
      throw new EmailError('Failed to add subscriber to list');
    }
  }

  public async sendTransactionalEmail(
    templateName: string,
    to: string,
    subject: string,
    variables: Record<string, any>
  ): Promise<void> {
    try {
      logEmailInfo('MailchimpClient', 'Sending transactional email', {
        template: templateName,
        to
      });

      await mailchimp.messages.send({
        message: {
          to: [{ email: to }],
          subject,
          from_email: MAILCHIMP_CONFIG.fromEmail,
          from_name: MAILCHIMP_CONFIG.fromName,
          template_name: templateName,
          template_content: [],
          global_merge_vars: Object.entries(variables).map(([name, content]) => ({
            name,
            content
          }))
        }
      });

      logEmailInfo('MailchimpClient', 'Transactional email sent successfully', {
        template: templateName,
        to
      });
    } catch (error) {
      logEmailError('MailchimpClient', 'Failed to send transactional email', error);
      throw new EmailError('Failed to send transactional email');
    }
  }
}