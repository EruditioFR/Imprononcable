import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config';
import { AirtableError } from '../errors';
import { logInfo, logError } from '../utils/logging';
import { getFieldValue } from '../utils/records';
import type { BlogPost, BlogFormData } from '../../../types/blog';

export class BlogService {
  private base: Airtable.Base;

  constructor() {
    Airtable.configure({ apiKey: AIRTABLE_CONFIG.apiKey });
    this.base = new Airtable().base(AIRTABLE_CONFIG.baseId);
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      logInfo('BlogService', 'Deleting article', { id });

      // First check if the article exists
      const record = await this.base('Blog').find(id).catch(() => null);
      if (!record) {
        throw new AirtableError('Article not found');
      }

      await this.base('Blog').destroy(id);
      logInfo('BlogService', 'Article deleted successfully');
    } catch (error) {
      logError('BlogService', 'Failed to delete article', error);
      throw new AirtableError(
        error instanceof Error ? error.message : 'Failed to delete article'
      );
    }
  }

  private async getClientName(clientId: string): Promise<string> {
    try {
      const record = await this.base('Clients').find(clientId);
      return record.get('Name') as string || '';
    } catch (error) {
      logError('BlogService', 'Failed to get client name', error);
      return '';
    }
  }

  async createArticle(data: BlogFormData): Promise<void> {
    try {
      logInfo('BlogService', 'Creating article', {
        title: data.title,
        client: data.client
      });

      // Préparer les champs pour Airtable
      const fields: Record<string, any> = {
        'Titre': data.title,
        'Contenu': data.content,
        'Extrait': data.excerpt,
        'Catégories': [data.category],
        'Status': data.status,
        'Date de publication': data.publishedAt,
        'Client': [data.client], // Utiliser l'ID du client
        'Auteur': [data.authorId] // Utiliser l'ID de l'auteur
      };

      // Gérer l'image
      if (data.image) {
        if (data.image.startsWith('data:')) {
          // C'est une nouvelle image uploadée
          fields['Image à la une'] = [{ url: data.image }];
          fields['URL image si mediatheque'] = null;
        } else {
          // C'est une URL de la médiathèque
          fields['URL image si mediatheque'] = data.image;
          fields['Image à la une'] = null;
        }
      }

      await this.base('Blog').create([{ fields }]);
      logInfo('BlogService', 'Article created successfully');
    } catch (error) {
      logError('BlogService', 'Failed to create article', error);
      throw new AirtableError('Impossible de créer l\'article');
    }
  }

  async getArticles(publishedOnly: boolean = false): Promise<BlogPost[]> {
    try {
      logInfo('BlogService', 'Fetching articles', { publishedOnly });

      const filterFormula = publishedOnly 
        ? "{Status} = 'published'"
        : '';

      const records = await this.base('Blog')
        .select({
          filterByFormula: filterFormula,
          sort: [{ field: 'Date de publication', direction: 'desc' }]
        })
        .all();

      logInfo('BlogService', `Found ${records.length} articles`, { publishedOnly });

      const articles = await Promise.all(records.map(async record => {
        // Récupérer l'ID du client depuis le champ Client
        const clientId = (getFieldValue<string[]>(record, 'Client') || [])[0];
        // Récupérer le nom du client depuis la table Clients
        const clientName = clientId ? await this.getClientName(clientId) : '';
        
        // Vérifier d'abord l'URL de la médiathèque
        const mediaLibraryUrl = getFieldValue<string>(record, 'URL image si mediatheque');
        // Si pas d'URL médiathèque, vérifier l'image uploadée
        const uploadedImage = getFieldValue<Array<{ url: string }>>(record, 'Image à la une');
        
        return {
          id: record.id,
          title: getFieldValue(record, 'Titre') || '',
          content: getFieldValue(record, 'Contenu') || '',
          client: clientName,
          clientId: clientId || '',
          author: getFieldValue(record, 'Nom et Prénom (from Auteur)') || '',
          authorId: (getFieldValue(record, 'Auteur') as string[])?.[0] || '',
          publishedAt: getFieldValue(record, 'Date de publication') || new Date().toISOString(),
          excerpt: getFieldValue(record, 'Extrait') || '',
          mediaLibraryUrl: mediaLibraryUrl || null,
          uploadedImage: uploadedImage?.[0]?.url || null,
          image: mediaLibraryUrl || uploadedImage?.[0]?.url || null,
          category: getFieldValue(record, 'Catégories')?.[0] || '',
          status: getFieldValue(record, 'Status') || 'draft'
        };
      }));

      return articles;
    } catch (error) {
      logError('BlogService', 'Failed to fetch articles', error);
      throw new AirtableError('Impossible de récupérer les articles');
    }
  }

  async getBlogPost(id: string): Promise<BlogPost> {
    try {
      logInfo('BlogService', 'Fetching blog post', { id });

      const record = await this.base('Blog').find(id);
      
      // Récupérer l'ID du client depuis le champ Client
      const clientId = (getFieldValue<string[]>(record, 'Client') || [])[0];
      // Récupérer le nom du client depuis la table Clients
      const clientName = clientId ? await this.getClientName(clientId) : '';
      
      // Vérifier d'abord l'URL de la médiathèque
      const mediaLibraryUrl = getFieldValue<string>(record, 'URL image si mediatheque');
      // Si pas d'URL médiathèque, vérifier l'image uploadée
      const uploadedImage = getFieldValue<Array<{ url: string }>>(record, 'Image à la une');

      return {
        id: record.id,
        title: getFieldValue(record, 'Titre') || '',
        content: getFieldValue(record, 'Contenu') || '',
        client: clientName,
        clientId: clientId || '',
        author: getFieldValue(record, 'Nom et Prénom (from Auteur)') || '',
        authorId: (getFieldValue(record, 'Auteur') as string[])?.[0] || '',
        publishedAt: getFieldValue(record, 'Date de publication') || new Date().toISOString(),
        excerpt: getFieldValue(record, 'Extrait') || '',
        mediaLibraryUrl: mediaLibraryUrl || null,
        uploadedImage: uploadedImage?.[0]?.url || null,
        image: mediaLibraryUrl || uploadedImage?.[0]?.url || null,
        category: getFieldValue(record, 'Catégories')?.[0] || '',
        status: getFieldValue(record, 'Status') || 'draft'
      };
    } catch (error) {
      logError('BlogService', 'Failed to fetch blog post', error);
      throw new AirtableError('Impossible de récupérer l\'article');
    }
  }

  async updateArticle(id: string, data: BlogFormData): Promise<void> {
    try {
      logInfo('BlogService', 'Updating article', { id });

      // Préparer les champs de base
      const fields: Record<string, any> = {
        'Titre': data.title,
        'Contenu': data.content,
        'Extrait': data.excerpt,
        'Catégories': [data.category],
        'Status': data.status,
        'Date de publication': data.publishedAt,
        'Client': [data.client], // Utiliser l'ID du client
        'Auteur': [data.authorId] // Utiliser l'ID de l'auteur
      };

      // Gérer l'image
      if (data.image) {
        if (data.image.startsWith('data:')) {
          // C'est une nouvelle image uploadée
          fields['Image à la une'] = [{ url: data.image }];
          fields['URL image si mediatheque'] = null;
        } else {
          // C'est une URL de la médiathèque
          fields['URL image si mediatheque'] = data.image;
          fields['Image à la une'] = null;
        }
      } else {
        // Pas d'image
        fields['URL image si mediatheque'] = null;
        fields['Image à la une'] = null;
      }

      await this.base('Blog').update(id, fields);
      logInfo('BlogService', 'Article updated successfully');
    } catch (error) {
      logError('BlogService', 'Failed to update article', error);
      throw new AirtableError('Impossible de mettre à jour l\'article');
    }
  }
}

export const blogService = new BlogService();