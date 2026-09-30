import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { Order, OrderListResult, OrderQueryParams } from "../types";

export const orderApi = {
  getMine: async (params?: OrderQueryParams): Promise<OrderListResult> => {
    const result = await apiClient.get<unknown>(API_ENDPOINTS.ORDERS.ME, { params });
    const payload = result as { orders?: Order[] } | Order[];
    return { orders: Array.isArray(payload) ? payload : payload.orders ?? [] };
  },
  getAll: async (params?: OrderQueryParams): Promise<OrderListResult> => {
    const result = await apiClient.get<unknown>(API_ENDPOINTS.ORDERS.LIST, { params });
    const payload = result as { orders?: Order[]; pagination?: OrderListResult["pagination"] } | Order[];
    if (Array.isArray(payload)) {
      const limit = Math.max(params?.limit ?? payload.length, 1);
      return { orders: payload, pagination: { total: payload.length, page: params?.page ?? 1, pages: Math.max(1, Math.ceil(payload.length / limit)) } };
    }
    return { orders: payload.orders ?? [], pagination: payload.pagination ?? { total: 0, page: params?.page ?? 1, pages: 1 } };
  },
  getById: (id: string) => apiClient.get<Order>(API_ENDPOINTS.ORDERS.DETAILS(id)),
  cancel: (id: string) => apiClient.patch<Order>(API_ENDPOINTS.ORDERS.CANCEL(id)),
} as const;
