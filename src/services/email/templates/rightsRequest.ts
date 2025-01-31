import type { Image } from '../../../types/gallery';
import type { RightsRequestFormData } from '../../../types/rightsRequest';
import { formatFrenchDate } from '../../../utils/dates';

export function generateRightsRequestEmail(
  image: Image,
  formData: RightsRequestFormData,
  userName: string,
  userEmail: string
): string {
  return `
    <h2>Nouvelle demande d'extension de droits</h2>
    
    <h3>Informations de l'image</h3>
    <img src="${image.url}" alt="${image.title}" style="max-width: 300px; margin: 10px 0; border-radius: 5px;">
    <ul>
      <li><strong>Titre:</strong> ${image.title}</li>
      <li><strong>URL:</strong> <a href="${image.url}">${image.url}</a></li>
      <li><strong>Date de fin actuelle:</strong> ${
        image.rights.endDate ? formatFrenchDate(image.rights.endDate) : 'Non spécifiée'
      }</li>
    </ul>

    <h3>Demande</h3>
    <ul>
      <li><strong>Date de début souhaitée:</strong> ${formatFrenchDate(formData.startDate)}</li>
      <li><strong>Date de fin souhaitée:</strong> ${formatFrenchDate(formData.endDate)}</li>
    </ul>

    <h3>Motif de la demande</h3>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 10px 0;">
      ${formData.reason.replace(/\n/g, '<br>')}
    </div>

    <h3>Informations utilisateur</h3>
    <ul>
      <li><strong>Nom:</strong> ${userName}</li>
      <li><strong>Email:</strong> ${userEmail}</li>
    </ul>
  `;
}