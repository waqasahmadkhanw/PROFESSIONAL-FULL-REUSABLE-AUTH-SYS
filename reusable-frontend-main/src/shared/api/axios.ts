import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { env } from "@/shared/config/env";
import { API_ENDPOINTS } from "./endpoints";
import { getRefreshToken } from "./refreshToken";
import { ApiError } from "./apiError";
import { clearCsrfToken, getCsrfToken } from "./csrf";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function isAuthEndpoint(url: string): boolean {
  try {
    const requestPath = new URL(url, env.API_URL).pathname.replace(/\/$/, "");
    const apiPath = new URL(env.API_URL).pathname.replace(/\/$/, "");
    const relativePath = requestPath.startsWith(apiPath)
      ? requestPath.slice(apiPath.length) || "/"
      : requestPath;

    return (
      Object.values(API_ENDPOINTS.AUTH).some(
        (value) => typeof value === "string" && relativePath === value,
      ) || relativePath.startsWith("/user/reset-password/")
    );
  } catch {
    return false;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT_MS,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  // Correlate browser requests with backend structured logs without sending
  // user data. The backend accepts/generates X-Request-Id and echoes it back.
  if (!config.headers["X-Request-Id"]) {
    const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    config.headers["X-Request-Id"] = requestId;
  }

  const method = String(config.method || "get").toUpperCase();
  if (typeof window !== "undefined" && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = await getCsrfToken();
    config.headers["X-CSRF-Token"] = token;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const url = originalRequest?.url ?? "";
    const authEndpoint = isAuthEndpoint(url);

    const method = String(originalRequest?.method || "get").toUpperCase();
    const csrfFailure = error.response?.status === 403 &&
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      String((error.response.data as { code?: string }).code || "").toUpperCase() === "CSRF_INVALID";

    // A rotated/expired CSRF token can be recovered transparently once.
    if (csrfFailure && originalRequest && !originalRequest._retry &&
        typeof window !== "undefined" && !["GET", "HEAD", "OPTIONS"].includes(method)) {
      originalRequest._retry = true;
      clearCsrfToken();
      const token = await getCsrfToken(true);
      originalRequest.headers["X-CSRF-Token"] = token;
      return apiClient(originalRequest);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !authEndpoint) {
      originalRequest._retry = true;
      try {
        await getRefreshToken();
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("app:auth-session-expired"));
        }
        return Promise.reject(new ApiError({ message: "Your session has expired.", statusCode: 401, code: "SESSION_EXPIRED" }));
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
