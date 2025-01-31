import { NotionError } from '../errors';
import { ERROR_MESSAGES } from '../constants';
import { formatErrorMessage } from '../utils/format';
import { logError, logInfo } from '../utils/logging';

export async function fetchWithErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    logInfo(`Starting ${context}`);
    const result = await operation();
    logInfo(`${context} completed successfully`);
    return result;
  } catch (error) {
    logError(`${context} failed`, error);

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // Map specific error messages to user-friendly errors
      if (message.includes('could not find') || message.includes('not found')) {
        throw new NotionError(ERROR_MESSAGES.PAGE_NOT_FOUND);
      }
      if (message.includes('unauthorized') || message.includes('invalid token')) {
        throw new NotionError(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
      }
      if (message.includes('validation error')) {
        throw new NotionError(ERROR_MESSAGES.INVALID_CONFIG);
      }
    }
    
    throw new NotionError(
      formatErrorMessage(error) || ERROR_MESSAGES.GENERIC_ERROR
    );
  }
}