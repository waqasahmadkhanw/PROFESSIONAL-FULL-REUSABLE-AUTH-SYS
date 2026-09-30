import type { AxiosRequestConfig } from "axios";
import apiClient from "./client";

/** Compatibility helpers backed by the single shared API client. */
export const request = <T>(config: AxiosRequestConfig): Promise<T> =>
  apiClient.request<T>(config);

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.get<T>(url, config);

export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.post<T>(url, data, config);

export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.put<T>(url, data, config);

export const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.patch<T>(url, data, config);

export const remove = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.delete<T>(url, config);
