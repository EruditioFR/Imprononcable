// Common types for Airtable services
export interface AirtableRecord {
  id: string;
  get(field: string): any;
}

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
    full: { url: string; width: number; height: number };
  };
}

export interface AirtableError extends Error {
  statusCode?: number;
  error?: string;
}