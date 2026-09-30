import { ApiError } from "./apiError";

function firstValidationMessage(errors: unknown): string | undefined {
  if (Array.isArray(errors)) {
    const first = errors.find((item) => typeof item === "string");
    return first as string | undefined;
  }

  if (errors && typeof errors === "object") {
    for (const value of Object.values(errors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        const first = value.find((item) => typeof item === "string");
        if (first) return first as string;
      }
      if (typeof value === "string") return value;
    }
  }

  return undefined;
}

/** Return a safe, user-facing message from any API/client error. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof ApiError) {
    return firstValidationMessage(error.errors) || error.message || fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
