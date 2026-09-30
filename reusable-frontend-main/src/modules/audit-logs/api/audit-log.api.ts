import { apiClient } from "@/shared/api";
import { AUDIT_LOG_ENDPOINTS } from "./audit-log.endpoints";
import type { AuditLog, AuditLogsResponse } from "../types/audit-log.types";

export const getAuditLogsApi = (
  params: { page: number; limit: number; search?: string; action?: string; resource?: string; user?: string; startDate?: string; endDate?: string },
) => apiClient.get<AuditLogsResponse>(AUDIT_LOG_ENDPOINTS.LIST, { params });

export const getAuditLogStatsApi = () => apiClient.get(AUDIT_LOG_ENDPOINTS.STATS);

export const getAuditLogByIdApi = (id: string) =>
  apiClient.get<AuditLog>(AUDIT_LOG_ENDPOINTS.DETAILS(id));

export const deleteAuditLogApi = (id: string) =>
  apiClient.delete(AUDIT_LOG_ENDPOINTS.DELETE(id));

export const clearAuditLogsApi = () =>
  apiClient.delete(AUDIT_LOG_ENDPOINTS.CLEAR, {
    data: { confirm: "DELETE_ALL" },
  });
