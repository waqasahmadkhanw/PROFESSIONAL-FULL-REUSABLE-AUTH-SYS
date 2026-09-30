import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { validateUploadFile } from "@/shared/api/uploadValidation";
import type {
  MediaItem,
  MediaListResult,
  MediaQueryParams,
  UpdateMediaPayload,
} from "../types";

/**
 * GET /api/media — paginated & filterable media list.
 */
export const getMediaListApi = async (
  params?: MediaQueryParams
): Promise<MediaListResult> => {
  const response = await apiClient.get<{
    media: MediaItem[];
    pagination: { total: number; page: number; pages: number };
    count: number;
  }>(API_ENDPOINTS.MEDIA.LIST, { params });

  return {
    media: response?.media ?? [],
    pagination: response?.pagination ?? { total: 0, page: 1, pages: 1 },
    count: response?.count ?? response?.media?.length ?? 0,
  };
};

/**
 * GET /api/media/:id — single media details.
 */
export const getMediaByIdApi = async (id: string): Promise<MediaItem> => {
  return apiClient.get<MediaItem>(API_ENDPOINTS.MEDIA.DETAILS(id));
};

/**
 * POST /api/media — upload file (multipart).
 */
export const uploadMediaFileApi = async (
  file: File,
  metadata?: { usage?: string; mediaType?: string; altText?: string; isPublic?: boolean }
): Promise<MediaItem> => {
  await validateUploadFile(file, "all");
  const formData = new FormData();
  formData.append("file", file);
  if (metadata?.usage) formData.append("usage", metadata.usage);
  if (metadata?.mediaType) formData.append("mediaType", metadata.mediaType);
  if (metadata?.altText) formData.append("altText", metadata.altText);
  if (metadata?.isPublic !== undefined) formData.append("isPublic", String(metadata.isPublic));

  return apiClient.post<MediaItem>(API_ENDPOINTS.MEDIA.UPLOAD, formData);
};

/**
 * PATCH /api/media/:id — update media metadata.
 */
export const updateMediaApi = async (
  id: string,
  payload: UpdateMediaPayload
): Promise<MediaItem> => {
  return apiClient.patch<MediaItem>(API_ENDPOINTS.MEDIA.UPDATE(id), payload);
};

/**
 * DELETE /api/media/:id — delete media asset.
 */
export const deleteMediaApi = async (id: string): Promise<void> => {
  return apiClient.delete(API_ENDPOINTS.MEDIA.DELETE(id));
};

export const mediaApi = {
  getMediaList: getMediaListApi,
  getMediaById: getMediaByIdApi,
  uploadMediaFile: uploadMediaFileApi,
  updateMedia: updateMediaApi,
  deleteMedia: deleteMediaApi,
} as const;
