// Custom error types for Airtable services
export class AirtableError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AirtableError';
  }
}

export class AuthorizationError extends AirtableError {
  constructor(message = 'Non autorisé') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ConfigurationError extends AirtableError {
  constructor(message = 'Configuration invalide') {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class NetworkError extends AirtableError {
  constructor(message = 'Erreur réseau') {
    super(message);
    this.name = 'NetworkError';
  }
}