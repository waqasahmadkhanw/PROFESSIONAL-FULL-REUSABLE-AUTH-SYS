import apiClient from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { validateUploadFile, validateUploadFiles, type UploadProfile } from "./uploadValidation";

/**
 * ===============================
 * Upload Response
 * ===============================
 */

export interface UploadResponse{
  url: string;
  publicId?: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
}

/**
 * ===============================
 * Upload API
 * ===============================
 */

export const uploadApi = {
  /**
   * Upload Single Image
   */
uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return apiClient.post<UploadResponse>(
      API_ENDPOINTS.MEDIA.UPLOAD,
      formData,
      {
  
      }
    );
  },

  /**
   * Upload Single File
   */
  async uploadFile(file: File, profile: UploadProfile = "all") {
    await validateUploadFile(file, profile);
    const formData = new FormData();

    formData.append("file", file);

    return apiClient.post<UploadResponse>(
      API_ENDPOINTS.MEDIA.UPLOAD,
      formData,
      {
  
      }
    );
  },

  /**
   * Upload Multiple Files
   */
  async uploadMultiple(files: File[], profile: UploadProfile = "all") {
    // The backend exposes `upload.single("file")`, not a multi-file
    // endpoint. Upload each file through the supported API instead of
    // sending an unsupported `files[]` field.
    await validateUploadFiles(files, profile);
    return Promise.all(files.map((file) => uploadApi.uploadFile(file, profile)));
  },
};

export default uploadApi;