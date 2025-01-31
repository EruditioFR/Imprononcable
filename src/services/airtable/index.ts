// Export all services from a single entry point
import { UserService } from './services/userService';
import { CreaPhotoService } from './services/creaPhotoService';
import { AirtableService } from './services/airtableService';

// Create and export singleton instances
const userService = new UserService();
const creaPhotoService = new CreaPhotoService();

export {
  userService,
  creaPhotoService,
  AirtableService
};

// Export types and utilities
export * from './types';
export * from './errors';
export * from './utils/logging';
export * from './utils/validation';
export * from './utils/records';