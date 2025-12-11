export class FastFoldError extends Error {}

export class AuthenticationError extends FastFoldError {}

export class APIError extends FastFoldError {
  statusCode?: number;
  responseBody?: unknown;
  constructor(message: string, statusCode?: number, responseBody?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export class RateLimitError extends APIError {}


