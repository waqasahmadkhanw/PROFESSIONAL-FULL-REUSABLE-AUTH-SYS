import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { Coupon, CouponListResult, CouponPayload, CouponQueryParams } from "../types";

export const couponApi = {
  getAll: async (params?: CouponQueryParams): Promise<CouponListResult> => {
    const result = await apiClient.get<unknown>(API_ENDPOINTS.COUPONS.LIST, { params });
    const payload = result as { coupons?: Coupon[]; pagination?: CouponListResult["pagination"] } | Coupon[];
    if (Array.isArray(payload)) {
      return { coupons: payload, pagination: { total: payload.length, page: params?.page ?? 1, pages: 1 } };
    }
    return {
      coupons: payload.coupons ?? [],
      pagination: payload.pagination ?? { total: 0, page: params?.page ?? 1, pages: 1 },
    };
  },
  getById: (id: string) => apiClient.get<Coupon>(API_ENDPOINTS.COUPONS.DETAILS(id)),
  create: (data: CouponPayload) => apiClient.post<Coupon>(API_ENDPOINTS.COUPONS.CREATE, data),
  update: (id: string, data: Partial<CouponPayload>) => apiClient.patch<Coupon>(API_ENDPOINTS.COUPONS.UPDATE(id), data),
  remove: (id: string) => apiClient.delete<null>(API_ENDPOINTS.COUPONS.DELETE(id)),
} as const;
