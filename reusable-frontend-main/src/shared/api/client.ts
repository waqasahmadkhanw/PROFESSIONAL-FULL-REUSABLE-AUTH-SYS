import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "./axios";
import { handleError, handleSuccess } from "./response";

/**
 * Single application API client.
 *
 * All feature modules should use this facade instead of importing Axios
 * directly. Authentication, CSRF, retry and error normalization remain
 * centralized in shared/api/axios.ts.
 */
class ApiClient {
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse = await axiosInstance.request<T>(config);
      return handleSuccess<T>(response);
    } catch (error) {
      return handleError(error);
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: "POST", data });
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: "PUT", data });
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: "PATCH", data });
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }
}

const apiClient = new ApiClient();

export default apiClient;
