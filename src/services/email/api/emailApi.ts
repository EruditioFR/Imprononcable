import type { EmailOptions } from '../types/email';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class EmailApi {
  private static instance: EmailApi;

  private constructor() {}

  public static getInstance(): EmailApi {
    if (!EmailApi.instance) {
      EmailApi.instance = new EmailApi();
    }
    return EmailApi.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email. Please try again later.');
    }
  }
}

export const emailApi = EmailApi.getInstance();