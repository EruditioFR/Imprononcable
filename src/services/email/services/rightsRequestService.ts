import type { Image } from '../../../types/gallery';
import type { RightsRequestFormData } from '../../../types/rightsRequest';
import { EMAIL_CONFIG } from '../config';
import { generateRightsRequestEmail } from '../templates/rightsRequest';
import { MailchimpProvider } from '../providers/mailchimp/provider';
import { logEmailInfo } from '../utils/logging';

export class RightsRequestService {
  private provider: MailchimpProvider;

  constructor() {
    this.provider = new MailchimpProvider();
  }

  async sendRequest(
    image: Image,
    formData: RightsRequestFormData,
    userName: string,
    userEmail: string
  ): Promise<void> {
    logEmailInfo('RightsRequestService', 'Sending rights request', {
      imageId: image.id,
      userName,
      userEmail
    });

    await this.provider.sendEmail({
      subject: `Demande d'extension de droits - ${image.title}`,
      htmlContent: generateRightsRequestEmail(image, formData, userName, userEmail),
      from: {
        email: EMAIL_CONFIG.email.fromAddress,
        name: EMAIL_CONFIG.email.fromName
      },
      to: {
        email: EMAIL_CONFIG.email.toAddress,
        name: EMAIL_CONFIG.email.toName
      }
    });
  }
}

export const rightsRequestService = new RightsRequestService();