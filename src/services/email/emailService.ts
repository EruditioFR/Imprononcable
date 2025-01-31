import { MailchimpTransactionalClient } from './providers/mailchimp/transactionalClient';
import { EMAIL_TEMPLATES } from './config/templates';
import type { EmailOptions } from './types/email';
import { logEmailInfo } from './utils/logging';
import { formatFrenchDate } from '../../utils/dates';

class EmailService {
  private static instance: EmailService;
  private client: MailchimpTransactionalClient;

  private constructor() {
    this.client = MailchimpTransactionalClient.getInstance();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendRightsRequest(
    imageTitle: string,
    imageUrl: string,
    currentEndDate: string | null,
    requestedStartDate: string,
    requestedEndDate: string,
    reason: string,
    userName: string,
    userEmail: string
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.rightsRequest;
    
    const options: EmailOptions = {
      to: [{ email: 'jbbejot+imprononcable@gmail.com', name: 'Administrateur Imprononcable' }],
      from: {
        email: template.fromEmail,
        name: template.fromName
      },
      subject: `${template.subject} - ${imageTitle}`,
      html: this.generateRightsRequestEmail(
        imageTitle,
        imageUrl,
        currentEndDate,
        requestedStartDate,
        requestedEndDate,
        reason,
        userName,
        userEmail
      )
    };

    logEmailInfo('EmailService', 'Sending rights request email', { userEmail });
    await this.client.sendEmail(options);
  }

  private generateRightsRequestEmail(
    imageTitle: string,
    imageUrl: string,
    currentEndDate: string | null,
    requestedStartDate: string,
    requestedEndDate: string,
    reason: string,
    userName: string,
    userEmail: string
  ): string {
    return `
      <h2>Nouvelle demande d'extension de droits</h2>
      
      <h3>Informations de l'image</h3>
      <img src="${imageUrl}" alt="${imageTitle}" style="max-width: 300px; margin: 10px 0; border-radius: 5px;">
      <ul>
        <li><strong>Titre:</strong> ${imageTitle}</li>
        <li><strong>URL:</strong> <a href="${imageUrl}">${imageUrl}</a></li>
        <li><strong>Date de fin actuelle:</strong> ${
          currentEndDate ? formatFrenchDate(currentEndDate) : 'Non spécifiée'
        }</li>
      </ul>

      <h3>Demande</h3>
      <ul>
        <li><strong>Date de début souhaitée:</strong> ${formatFrenchDate(requestedStartDate)}</li>
        <li><strong>Date de fin souhaitée:</strong> ${formatFrenchDate(requestedEndDate)}</li>
      </ul>

      <h3>Motif de la demande</h3>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${reason.replace(/\n/g, '<br>')}
      </div>

      <h3>Informations utilisateur</h3>
      <ul>
        <li><strong>Nom:</strong> ${userName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
      </ul>
    `;
  }
}

export const emailService = EmailService.getInstance();