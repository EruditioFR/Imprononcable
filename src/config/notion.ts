import { validateConfig } from '../services/notion/validation';
import { formatPageId } from '../services/notion/utils/format';

const config = {
  apiKey: import.meta.env.VITE_NOTION_API_KEY || '',
  pageId: formatPageId('15e686c5c9f1805798cef692944e27ce')
};

export const NOTION_CONFIG = validateConfig(config);