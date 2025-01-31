export interface EmailAddress {
  email: string;
  name: string;
}

export interface EmailMessage {
  subject: string;
  htmlContent: string;
  from: EmailAddress;
  to: EmailAddress;
}

export class EmailError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'EmailError';
  }
}