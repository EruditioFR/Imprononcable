// Utility functions for logging
export function logInfo(context: string, message: string, data?: any) {
  console.log(`[Airtable:${context}] ${message}`, data);
}

export function logError(context: string, message: string, error: unknown) {
  console.error(`[Airtable:${context}] ${message}:`, error);
}