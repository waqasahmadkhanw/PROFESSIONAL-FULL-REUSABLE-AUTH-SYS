"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  deleteNotificationApi,
  markAllReadApi,
  markAsReadApi,
  sendNotificationApi,
} from "../api";
import type { SendNotificationRequest } from "../types";

/**
 * Send a notification (admin).
 */
export const useSendNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendNotificationRequest) => sendNotificationApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL });
    },
  });
};

/**
 * Mark all notifications as read.
 */
export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllReadApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
      });
    },
  });
};

/**
 * Mark a single notification as read.
 */
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsReadApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
      });
    },
  });
};

/**
 * Delete a notification.
 */
export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotificationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT,
      });
    },
  });
};
