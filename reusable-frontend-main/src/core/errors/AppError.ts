export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, options: { code?: string; status?: number; details?: unknown } = {}) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? "APP_ERROR";
    this.status = options.status;
    this.details = options.details;
  }
}
