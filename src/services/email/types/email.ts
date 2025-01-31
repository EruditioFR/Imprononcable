export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailSender {
  email: string;
  name: string;
}

export interface EmailAttachment {
  name: string;
  content: string;
  type: string;
}

export interface EmailOptions {
  to: EmailRecipient[];
  from: EmailSender;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  templateId?: string;
  templateData?: Record<string, unknown>;
}

export class EmailError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'EmailError';
  }
}