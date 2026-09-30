import { getAuditLogsApi } from "../api";

export const auditLogService = {
  list: getAuditLogsApi,
} as const;
