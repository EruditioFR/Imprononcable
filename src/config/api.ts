export const API_CONFIG = {
  baseUrl: process.env.VITE_API_BASE_URL || 'https://api.example.com',
  endpoints: {
    rightsRequest: '/api/rights-request'
  }
} as const;