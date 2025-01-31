import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../../config/email';

class EmailClient {
  private static instance: EmailClient;
  private initialized = false;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): EmailClient {
    if (!EmailClient.instance) {
      EmailClient.instance = new EmailClient();
    }
    return EmailClient.instance;
  }

  public init(): void {
    if (!this.initialized) {
      emailjs.init(EMAIL_CONFIG.USER_ID);
      this.initialized = true;
    }
  }

  public async sendEmail(templateId: string, templateParams: Record<string, string>): Promise<void> {
    if (!this.initialized) {
      this.init();
    }

    try {
      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        templateId,
        templateParams
      );

      if (response.status !== 200) {
        throw new Error(`Email sending failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new EmailError('Failed to send email. Please try again later.');
    }
  }
}

export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailError';
  }
}

export const emailClient = EmailClient.getInstance();