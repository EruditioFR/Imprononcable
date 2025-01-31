import { emailClient } from './emailClient';
import { EMAIL_CONFIG, EMAIL_TEMPLATE_VARS } from '../../config/email';
import type { RightsRequestFormData } from '../../types/rightsRequest';
import type { Image } from '../../types/gallery';
import { formatFrenchDate } from '../../utils/dates';
import { useAuth } from '../../contexts/AuthContext';

export class RightsRequestEmailService {
  async sendRequest(image: Image, formData: RightsRequestFormData): Promise<void> {
    const { user } = useAuth();
    
    const templateParams = {
      [EMAIL_TEMPLATE_VARS.TO_EMAIL]: EMAIL_CONFIG.RECIPIENT_EMAIL,
      [EMAIL_TEMPLATE_VARS.IMAGE_TITLE]: image.title,
      [EMAIL_TEMPLATE_VARS.IMAGE_URL]: image.url,
      [EMAIL_TEMPLATE_VARS.CURRENT_END_DATE]: image.rights.endDate 
        ? formatFrenchDate(image.rights.endDate) 
        : 'Non spécifiée',
      [EMAIL_TEMPLATE_VARS.REQUESTED_START_DATE]: formatFrenchDate(formData.startDate),
      [EMAIL_TEMPLATE_VARS.REQUESTED_END_DATE]: formatFrenchDate(formData.endDate),
      [EMAIL_TEMPLATE_VARS.REASON]: formData.reason,
      [EMAIL_TEMPLATE_VARS.USER_NAME]: user?.prenom || 'Utilisateur',
      [EMAIL_TEMPLATE_VARS.USER_EMAIL]: user?.email || 'Non spécifié'
    };

    await emailClient.sendEmail(EMAIL_CONFIG.TEMPLATE_ID, templateParams);
  }
}

export const rightsRequestEmailService = new RightsRequestEmailService();