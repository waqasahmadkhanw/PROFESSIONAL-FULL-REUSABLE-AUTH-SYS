export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  meta?: { page: number; limit: number; total: number; totalPages: number } & Record<string, unknown>;
}
