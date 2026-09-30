export interface MediaUploader {
  _id: string;
  name?: string;
  email?: string;
}

export type MediaResourceType = "image" | "video" | "raw" | "auto" | string;
export type MediaKind = "image" | "video" | "document" | "audio" | "other" | string;

export interface MediaItem {
  _id: string;
  uploadedBy?: string | MediaUploader | null;
  publicId: string;
  url: string;
  secureUrl?: string;
  filename?: string;
  format?: string;
  resourceType?: MediaResourceType;
  size?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  mediaType?: MediaKind;
  usage?: string;
  altText?: string;
  isPublic?: boolean;
  status?: "active" | "deleted" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaPagination {
  total: number;
  page: number;
  pages: number;
}

export interface MediaListResult {
  media: MediaItem[];
  pagination: MediaPagination;
  count: number;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  mediaType?: string;
  usage?: string;
  search?: string;
  uploadedBy?: string;
  [key: string]: unknown;
}

export interface UpdateMediaPayload {
  altText?: string;
  usage?: string;
  isPublic?: boolean;
}
