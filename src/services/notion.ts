import type { Image } from '../types/gallery';

const NOTION_API_ENDPOINT = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

interface NotionResponse {
  results: Array<{
    id: string;
    properties: {
      Title: {
        title: Array<{
          plain_text: string;
        }>;
      };
      URL: {
        url: string;
      };
      Categories: {
        multi_select: Array<{
          name: string;
        }>;
      };
    };
  }>;
}

export class NotionService {
  private apiKey: string;
  private databaseId: string;

  constructor(apiKey: string, databaseId: string) {
    this.apiKey = apiKey;
    this.databaseId = databaseId;
  }

  private async fetchNotionAPI(endpoint: string, options: RequestInit = {}) {
    try {
      const headers = new Headers({
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      });

      const response = await fetch(`${NOTION_API_ENDPOINT}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        console.error('Notion API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: errorData,
        });

        throw new Error(
          `Notion API error (${response.status}): ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Notion API request failed: ${error.message}`);
      }
      throw new Error('Notion API request failed with an unknown error');
    }
  }

  async getImages(): Promise<Image[]> {
    try {
      console.log('Fetching images from Notion database:', this.databaseId);
      
      const response = await this.fetchNotionAPI(`/databases/${this.databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            and: [
              {
                property: 'Title',
                title: {
                  is_not_empty: true,
                },
              },
              {
                property: 'URL',
                url: {
                  is_not_empty: true,
                },
              },
            ],
          },
          sorts: [
            {
              property: 'Title',
              direction: 'ascending',
            },
          ],
          page_size: 100,
        }),
      }) as NotionResponse;

      if (!response.results || !Array.isArray(response.results)) {
        throw new Error('Invalid response format from Notion API');
      }

      console.log('Successfully fetched Notion data:', {
        resultCount: response.results.length,
      });

      return response.results
        .filter(item => {
          const hasUrl = item.properties.URL?.url;
          const hasTitle = item.properties.Title?.title?.[0]?.plain_text;
          
          if (!hasUrl || !hasTitle) {
            console.warn('Skipping item due to missing required fields:', {
              id: item.id,
              hasUrl,
              hasTitle,
            });
            return false;
          }
          return true;
        })
        .map(item => ({
          id: item.id,
          title: item.properties.Title.title[0].plain_text,
          url: item.properties.URL.url,
          categories: item.properties.Categories?.multi_select?.map(category => category.name) || [],
          width: 1200, // Default width, will be updated when image loads
          height: 800, // Default height, will be updated when image loads
        }));
    } catch (error) {
      console.error('Failed to fetch images from Notion:', error);
      throw error;
    }
  }
}