import { SearchableField } from '../types/gallery';

export const searchableFields: SearchableField[] = [
  { name: 'Titre', type: 'text', field: 'title' },
  { name: 'Catégories', type: 'multiselect', field: 'categories' },
  { name: 'Tags', type: 'multiselect', field: 'tags' },
  { name: 'Lieux', type: 'multiselect', field: 'locations' },
  { name: 'Thèmes', type: 'multiselect', field: 'themes' }
];