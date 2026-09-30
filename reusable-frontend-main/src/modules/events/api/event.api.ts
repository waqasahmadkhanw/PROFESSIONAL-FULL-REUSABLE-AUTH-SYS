import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { AppEvent, EventListResult, EventPayload, EventStatus } from "../types";

interface EventListPayload {
  events?: AppEvent[];
  data?: AppEvent[];
  pagination?: { total?: number };
}

const list = async (): Promise<EventListResult> => {
  const result = await apiClient.get<AppEvent[] | EventListPayload>(API_ENDPOINTS.EVENTS.LIST);
  if (Array.isArray(result)) return { events: result, total: result.length };
  const events = result.events ?? result.data ?? [];
  return { events, total: result.pagination?.total ?? events.length };
};

export const eventApi = {
  getAll: list,
  getById: (id: string) => apiClient.get<AppEvent>(API_ENDPOINTS.EVENTS.DETAILS(id)),
  create: (data: EventPayload) => apiClient.post<AppEvent>(API_ENDPOINTS.EVENTS.CREATE, data),
  update: (id: string, data: Partial<EventPayload>) => apiClient.put<AppEvent>(API_ENDPOINTS.EVENTS.UPDATE(id), data),
  remove: (id: string) => apiClient.delete<null>(API_ENDPOINTS.EVENTS.DELETE(id)),
  status: (id: string, status: EventStatus) => apiClient.patch<AppEvent>(API_ENDPOINTS.EVENTS.STATUS(id), { status }),
};
