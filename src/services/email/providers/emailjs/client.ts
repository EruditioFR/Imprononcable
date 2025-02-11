import type { EmailOptions } from '../../types/email';
import { EmailError } from '../../errors';
import { logEmailInfo, logEmailError } from '../../utils/logging';

export class EmailJSClient {
  private static instance: EmailJSClient;
  private readonly SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  private readonly TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  private readonly USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

  private constructor() {
    if (!this.SERVICE_ID || !this.TEMPLATE_ID || !this.USER_ID) {
      throw new EmailError('EmailJS configuration is missing');
    }
  }

  public static getInstance(): EmailJSClient {
    if (!EmailJSClient.instance) {
      EmailJSClient.instance = new EmailJSClient();
    }
    return EmailJSClient.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      logEmailInfo('EmailJSClient', 'Sending email', {
        to: options.to.map(r => r.email),
        subject: options.subject
      });

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: this.SERVICE_ID,
          template_id: this.TEMPLATE_ID,
          user_id: this.USER_ID,
          template_params: {
            to_email: options.to.map(r => r.email).join(', '),
            subject: options.subject,
            message_html: options.html,
            message_text: options.text
          }
        })
      });

      if (!response.ok) {
        throw new Error(`EmailJS error: ${response.statusText}`);
      }

      logEmailInfo('EmailJSClient', 'Email sent successfully');
    } catch (error) {
      logEmailError('EmailJSClient', 'Failed to send email', error);
      throw new EmailError('Failed to send email', error instanceof Error ? error : undefined);
    }
  }
}