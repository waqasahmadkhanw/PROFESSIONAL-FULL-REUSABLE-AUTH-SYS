import { apiClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { validateUploadFile } from "@/shared/api/uploadValidation";
import type { ProfileUser, UpdateProfilePayload, UpdateSocialLinksPayload } from '../types';

export const profileApi = {
  get: () => apiClient.get<ProfileUser>(API_ENDPOINTS.PROFILE.GET),
  update: (data: UpdateProfilePayload) => apiClient.patch<ProfileUser>(API_ENDPOINTS.PROFILE.UPDATE, data),
  updateSocials: (data: UpdateSocialLinksPayload) => apiClient.patch<ProfileUser>(API_ENDPOINTS.PROFILE.SOCIALS, data),
  uploadAvatar: async (avatar: File) => { await validateUploadFile(avatar, "image"); const form = new FormData(); form.append('avatar', avatar); return apiClient.post<ProfileUser>(API_ENDPOINTS.PROFILE.AVATAR, form); },
  deleteAvatar: () => apiClient.delete<null>(API_ENDPOINTS.PROFILE.DELETE_AVATAR),
  deleteAccount: () => apiClient.delete(API_ENDPOINTS.PROFILE.DELETE),
};
