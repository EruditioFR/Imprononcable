import { emailConfigSchema } from '../types/config';

const config = {
  mailchimp: {
    apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY,
    serverPrefix: import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX,
    listId: import.meta.env.VITE_MAILCHIMP_LIST_ID
  },
  email: {
    fromAddress: import.meta.env.VITE_EMAIL_FROM_ADDRESS,
    fromName: import.meta.env.VITE_EMAIL_FROM_NAME,
    toAddress: import.meta.env.VITE_EMAIL_TO_ADDRESS,
    toName: import.meta.env.VITE_EMAIL_TO_NAME
  }
};

export const EMAIL_CONFIG = emailConfigSchema.parse(config);