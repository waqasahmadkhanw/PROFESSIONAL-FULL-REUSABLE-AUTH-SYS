import axios, { AxiosResponse } from "axios";
import { ApiError } from "./apiError";

/** Canonical success envelope used by the reusable backend. */
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

/** Canonical failure envelope used by the reusable backend. */
export interface ApiErrorResponse {
  statusCode: number;
  success: false;
  data: null;
  message: string;
  errors?: unknown;
  code?: string;
  requestId?: string;
}

export function handleSuccess<T>(
  response: AxiosResponse<ApiResponse<T> | T>,
): T {
  const body = response.data as ApiResponse<T> | T;

  if (
    body !== null &&
    typeof body === "object" &&
    "success" in body &&
    (body as ApiResponse<T>).success === true &&
    "data" in body
  ) {
    return (body as ApiResponse<T>).data;
  }

  return body as T;
}

export function handleError(error: unknown): never {
  if (error instanceof ApiError) throw error;

  if (axios.isAxiosError(error)) {
    const response = error.response?.data as Partial<ApiErrorResponse> | undefined;
    const message =
      response && typeof response.message === "string"
        ? response.message
        : error.message || "Something went wrong.";

    throw new ApiError({
      message,
      errors: response?.errors,
      statusCode: response?.statusCode ?? error.response?.status ?? 500,
      code: response?.code,
      requestId: response?.requestId ?? error.response?.headers?.["x-request-id"],
      retryAfter: error.response?.headers?.["retry-after"],
    });
  }

  if (error instanceof Error) {
    throw new ApiError({ message: error.message, statusCode: 500 });
  }

  throw new ApiError({ message: "Unexpected error occurred.", statusCode: 500 });
}

export function isSuccess(
  response: AxiosResponse<ApiResponse<unknown>>,
): boolean {
  return response.data.success;
}

export function getMessage(
  response: AxiosResponse<ApiResponse<unknown>>,
): string {
  return response.data.message;
}
