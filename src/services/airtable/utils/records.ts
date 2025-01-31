import type { AirtableRecord } from '../types';

export function getFieldValue<T>(record: AirtableRecord, field: string): T | null {
  try {
    return record.get(field) as T;
  } catch (error) {
    console.warn(`Failed to get field "${field}" from record:`, error);
    return null;
  }
}

export function getRequiredFieldValue<T>(record: AirtableRecord, field: string): T {
  const value = getFieldValue<T>(record, field);
  if (value === null) {
    throw new Error(`Required field "${field}" is missing or invalid`);
  }
  return value;
}