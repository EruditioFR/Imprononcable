export function logVideoError(message: string, error: unknown) {
  console.error(`[Video] ${message}:`, error);
}