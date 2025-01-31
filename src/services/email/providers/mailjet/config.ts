import { EMAIL_CONFIG } from '../../../../config/email';

export function getMailjetConfig() {
  const { apiKey, apiSecret } = EMAIL_CONFIG.mailjet;
  
  if (!apiKey || !apiSecret) {
    throw new Error('Mailjet API credentials are missing');
  }

  return {
    apiKey,
    apiSecret,
    apiUrl: 'https://api.mailjet.com/v3.1/send'
  } as const;
}