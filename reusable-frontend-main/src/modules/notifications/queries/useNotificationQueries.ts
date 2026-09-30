"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getNotificationsApi, getUnreadCountApi } from "../api";
import type { NotificationQueryParams } from "../types";

/**
 * Fetch paginated notifications list.
 */
export const useNotificationsQuery = (params?: NotificationQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(params),
    queryFn: () => getNotificationsApi(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Fetch unread count.
 */
export const useUnreadCountQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
    queryFn: () => getUnreadCountApi(),
  });
};

export const useMyNotificationsQuery = (params?: NotificationQueryParams) => useNotificationsQuery(params);
