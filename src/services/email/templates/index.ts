export const EMAIL_TEMPLATES = {
  rightsRequest: {
    subject: (imageTitle: string) => `Demande d'extension de droits - ${imageTitle}`
  }
} as const;