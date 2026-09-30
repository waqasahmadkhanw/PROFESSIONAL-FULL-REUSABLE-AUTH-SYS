import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { mapUser, mapLoginResponse } from "../utils/auth.mapper";

import { validateUploadFile } from "@/shared/api/uploadValidation";
import type {
  ChangePasswordResponse,
  CurrentUserResponse,
  DeleteAccountResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  ResetPasswordResponse,
  UpdateProfileResponse,
} from "../types";

export const loginApi = (data: { email: string; password: string }) =>
  apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data).then(mapLoginResponse);

export const registerApi = (data: { name: string; email: string; password: string }) =>
  apiClient.post<RegisterResponse & { _id?: string }>(API_ENDPOINTS.AUTH.REGISTER, data).then(mapUser);

export const logoutApi = () => apiClient.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);

export const currentUserApi = () =>
  apiClient.get<CurrentUserResponse & { _id?: string }>(API_ENDPOINTS.AUTH.CURRENT_USER).then(mapUser);

export const refreshTokenApi = () =>
  apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

export const forgotPasswordApi = (data: { email: string }) =>
  apiClient.post<ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);

export const resetPasswordApi = (data: { token: string; password: string }) =>
  apiClient.post<ResetPasswordResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD(data.token), {
    password: data.password,
  });

export const changePasswordApi = (data: { oldPassword: string; newPassword: string }) =>
  apiClient.patch<ChangePasswordResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);

export const updateProfileApi = (data: Record<string, unknown>) =>
  apiClient.patch<UpdateProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, data);

export const uploadAvatarApi = async ({ avatar }: { avatar: File }) => {
  await validateUploadFile(avatar, "image");
  const formData = new FormData();
  formData.append("avatar", avatar);
  return apiClient.post<UpdateProfileResponse>(API_ENDPOINTS.PROFILE.AVATAR, formData);
};

export const deleteAccountApi = () =>
  apiClient.delete<DeleteAccountResponse>(API_ENDPOINTS.PROFILE.DELETE);
