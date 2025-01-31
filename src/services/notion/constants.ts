export const NOTION_API_VERSION = '2022-06-28';
export const NOTION_API_BASE_URL = 'https://api.notion.com/v1';

export const ERROR_MESSAGES = {
  INVALID_CONFIG: 'Invalid Notion configuration',
  MISSING_API_KEY: 'Notion API key is required',
  MISSING_PAGE_ID: 'Notion page ID is required',
  PAGE_NOT_FOUND: 'Page not found',
  BLOCK_NOT_FOUND: 'Block not found',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to access this resource',
  GENERIC_ERROR: 'An error occurred while fetching Notion content'
} as const;