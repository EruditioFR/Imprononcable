export function logEmailInfo(context: string, message: string, data?: any) {
  console.log(`[Email:${context}] ${message}`, data);
}

export function logEmailError(context: string, message: string, error: unknown) {
  console.error(`[Email:${context}] ${message}:`, error);
}