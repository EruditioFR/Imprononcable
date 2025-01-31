export function formatPageId(pageId: string): string {
  return pageId.replace(/[^a-zA-Z0-9]/g, '');
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}