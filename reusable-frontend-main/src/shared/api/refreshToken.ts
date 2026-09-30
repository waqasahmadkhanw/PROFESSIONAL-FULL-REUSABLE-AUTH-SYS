import axios from "axios";

import { env } from "@/shared/config/env";
import { API_ENDPOINTS } from "./endpoints";
import { getCsrfToken } from "./csrf";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown | null) {
  const queue = failedQueue;
  failedQueue = [];

  queue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve();
  });
}

/**
 * Refresh the backend session using the HttpOnly refresh-token cookie.
 * No access/refresh token is returned to application code or persisted.
 */
export async function refreshAccessToken(): Promise<void> {
  try {
    const csrfToken = await getCsrfToken();
    await axios.post(
      `${env.API_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      undefined,
      { withCredentials: true, headers: { "X-CSRF-Token": csrfToken } }
    );
  } catch (error) {
    // Preserve the backend status/message. The interceptor will decide how
    // to handle the failed session without assuming an error response shape.
    throw error;
  }
}

/**
 * Single-flight refresh. Concurrent 401 responses wait for the same refresh
 * request instead of creating a refresh-token race.
 */
export async function getRefreshToken(): Promise<void> {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    await refreshAccessToken();
    processQueue(null);
  } catch (error) {
    processQueue(error);
    throw error;
  } finally {
    isRefreshing = false;
  }
}
