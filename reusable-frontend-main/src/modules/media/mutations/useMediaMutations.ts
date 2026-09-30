"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  deleteMediaApi,
  updateMediaApi,
  uploadMediaFileApi,
} from "../api/media.api";
import type { UpdateMediaPayload } from "../types";

/**
 * Upload single media file.
 */
export const useUploadMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      metadata,
    }: {
      file: File;
      metadata?: { usage?: string; mediaType?: string; altText?: string; isPublic?: boolean };
    }) => uploadMediaFileApi(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA.ALL });
    },
  });
};

/**
 * Update media metadata (altText, usage, isPublic, etc).
 */
export const useUpdateMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMediaPayload;
    }) => updateMediaApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDIA.DETAILS(variables.id),
      });
    },
  });
};

/**
 * Delete media item by ID.
 */
export const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMediaApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA.ALL });
    },
  });
};
