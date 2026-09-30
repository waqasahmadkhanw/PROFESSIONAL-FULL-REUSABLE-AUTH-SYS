"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMediaByIdApi, getMediaListApi } from "../api/media.api";
import type { MediaListResult, MediaQueryParams } from "../types";

/**
 * Query for media library list.
 */
export const useMediaQueryList = (params?: MediaQueryParams) => {
  return useQuery<MediaListResult>({
    queryKey: QUERY_KEYS.MEDIA.LIST(params),
    queryFn: () => getMediaListApi(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Query for single media item.
 */
export const useMediaByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEDIA.DETAILS(id ?? ""),
    queryFn: () => getMediaByIdApi(id!),
    enabled: Boolean(id),
  });
};
