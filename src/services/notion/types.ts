export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

export interface NotionPage {
  id: string;
  properties: Record<string, any>;
}