export const EMAIL_TEMPLATES = {
  welcome: {
    name: 'welcome-email',
    subject: 'Bienvenue sur CollabSpace',
    fromName: 'CollabSpace',
    fromEmail: 'noreply@collabspace.com',
  },
  rightsRequest: {
    name: 'rights-request',
    subject: 'Nouvelle demande d\'extension de droits',
    fromName: 'CollabSpace',
    fromEmail: 'noreply@collabspace.com',
  },
  sharedAlbum: {
    name: 'shared-album',
    subject: 'Album photo partagé',
    fromName: 'CollabSpace',
    fromEmail: 'noreply@collabspace.com',
  }
} as const;