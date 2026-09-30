/**
 * Canonical error object for backend failures.
 *
 * The reusable backend returns a stable envelope:
 * { statusCode, success: false, data: null, message, errors?, requestId? }
 * `errors` is intentionally unknown because validation middleware may return
 * arrays while some consuming applications may return field maps.
 */
export interface ApiErrorOptions {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: unknown;
  requestId?: string;
  retryAfter?: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly errors?: unknown;
  public readonly requestId?: string;
  public readonly retryAfter?: string;

  constructor({
    message,
    statusCode = 500,
    code,
    errors,
    requestId,
    retryAfter,
  }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.statusCode = Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599
      ? statusCode
      : 500;
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  static validation(errors: unknown, message = "Validation failed.") {
    return new ApiError({ message, statusCode: 422, errors });
  }

  static unauthorized(message = "Authentication required.") {
    return new ApiError({ message, statusCode: 401 });
  }

  static forbidden(message = "Forbidden.") {
    return new ApiError({ message, statusCode: 403 });
  }

  static notFound(message = "Resource not found.") {
    return new ApiError({ message, statusCode: 404 });
  }

  static conflict(message = "The request conflicts with the current resource state.") {
    return new ApiError({ message, statusCode: 409 });
  }

  static rateLimited(message = "Too many requests. Please try again later.", retryAfter?: string) {
    return new ApiError({ message, statusCode: 429, retryAfter });
  }

  static server(message = "Internal server error.") {
    return new ApiError({ message, statusCode: 500 });
  }
}

export default ApiError;
