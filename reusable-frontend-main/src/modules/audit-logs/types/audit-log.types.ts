export interface AuditLog {
  _id: string;
  action?: string;
  resource?: string;
  method?: string;
  statusCode?: number;
  createdAt?: string;
  user?: { name?: string; email?: string } | null;
}

export interface AuditLogsResponse {
  logs?: AuditLog[];
  pagination?: { total?: number; page?: number; pages?: number };
  count?: number;
}
