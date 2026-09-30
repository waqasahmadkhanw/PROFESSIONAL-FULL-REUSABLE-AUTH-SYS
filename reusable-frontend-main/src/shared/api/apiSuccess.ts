/**
 * ==========================================
 * API Success Utilities
 * ==========================================
 */

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedApiSuccess<T = unknown> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  statusCode: number;
  timestamp: string;
}

/**
 * Create Standard Success Response
 */
export function createSuccess<T>(
  data: T,
  message = "Success",
  statusCode = 200
): ApiSuccess<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create Paginated Success Response
 */
export function createPaginatedSuccess<T>(
  data: T[],
  pagination: PaginationMeta,
  message = "Success",
  statusCode = 200
): PaginatedApiSuccess<T> {
  return {
    success: true,
    message,
    data,
    pagination,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Type Guard
 */
export function isApiSuccess<T>(
  response: unknown
): response is ApiSuccess<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as ApiSuccess<T>).success === true
  );
}

/**
 * Extract Response Data
 */
export function getResponseData<T>(
  response: ApiSuccess<T>
): T {
  return response.data;
}

/**
 * Extract Response Message
 */
export function getResponseMessage(
  response: ApiSuccess
): string {
  return response.message;
}