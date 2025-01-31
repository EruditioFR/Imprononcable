import { RightsRequestFormData } from '../types/rightsRequest';
import { Image } from '../types/gallery';
import { formatFrenchDate } from '../utils/dates';

export class EmailService {
  private readonly EMAIL_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
  private readonly SERVICE_ID = 'service_default';
  private readonly TEMPLATE_ID = 'template_default';
  private readonly USER_ID = 'YOUR_USER_ID'; // Replace with your EmailJS user ID

  async sendRightsRequest(image: Image, formData: RightsRequestFormData): Promise<void> {
    const templateParams = {
      to_email: 'jbbejot@gmail.com',
      image_title: image.title,
      image_url: image.url,
      current_end_date: image.rights.endDate ? formatFrenchDate(image.rights.endDate) : 'Non spécifiée',
      requested_start_date: formatFrenchDate(formData.startDate),
      requested_end_date: formatFrenchDate(formData.endDate),
      reason: formData.reason,
    };

    try {
      const response = await fetch(this.EMAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: this.SERVICE_ID,
          template_id: this.TEMPLATE_ID,
          user_id: this.USER_ID,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email request');
    }
  }
}