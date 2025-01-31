interface LogContext {
  [key: string]: unknown;
}

export function logInfo(message: string, context?: LogContext): void {
  console.log(`[Notion] ${message}`, context);
}

export function logError(message: string, error: unknown, context?: LogContext): void {
  console.error(`[Notion] ${message}:`, {
    error,
    ...context
  });
}