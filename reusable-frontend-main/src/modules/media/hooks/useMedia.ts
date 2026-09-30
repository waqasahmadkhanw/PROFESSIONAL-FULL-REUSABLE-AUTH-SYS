"use client";

import { useMediaQueryList } from "../queries";
import {
  useDeleteMediaMutation,
  useUpdateMediaMutation,
  useUploadMediaMutation,
} from "../mutations";
import type { MediaQueryParams, UpdateMediaPayload } from "../types";

export const useMedia = (params?: MediaQueryParams) => {
  const query = useMediaQueryList(params);
  const uploadMutation = useUploadMediaMutation();
  const updateMutation = useUpdateMediaMutation();
  const deleteMutation = useDeleteMediaMutation();

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    uploadFile: (file: File, metadata?: { usage?: string; mediaType?: string; altText?: string }) =>
      uploadMutation.mutateAsync({ file, metadata }),
    isUploading: uploadMutation.isPending,
    updateMedia: (id: string, payload: UpdateMediaPayload) =>
      updateMutation.mutateAsync({ id, payload }),
    isUpdating: updateMutation.isPending,
    deleteMedia: (id: string) => deleteMutation.mutateAsync(id),
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables,
  };
};

export default useMedia;
