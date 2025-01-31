import type { Image } from '../types/gallery';

export function searchInMultiSelectField(values: string[] | undefined, query: string): boolean {
  if (!values || !Array.isArray(values)) {
    return false;
  }
  return values.some(value => 
    value.toLowerCase().includes(query.toLowerCase())
  );
}

export function searchInTextField(value: string | undefined, query: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return value.toLowerCase().includes(query.toLowerCase());
}

export function searchInAllFields(image: Image, query: string): boolean {
  if (!query.trim()) return true;

  const searchTerms = query.toLowerCase().split(' ');

  return searchTerms.every(term => {
    // Vérifier dans tous les champs textuels
    if (
      (image.title && image.title.toLowerCase().includes(term)) ||
      (image.client && image.client.toLowerCase().includes(term)) ||
      (image.description && image.description.toLowerCase().includes(term)) ||
      (image.author && image.author.toLowerCase().includes(term)) ||
      // Ajouter la recherche dans les tags proposés comme texte
      (image['tags proposés'] && image['tags proposés'].toLowerCase().includes(term))
    ) {
      return true;
    }

    // Vérifier dans les tableaux
    if (
      (image.categories && searchInMultiSelectField(image.categories, term)) ||
      (image.tags && searchInMultiSelectField(image.tags, term))
    ) {
      return true;
    }

    return false;
  });
}