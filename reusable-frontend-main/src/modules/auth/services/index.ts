export * from "./auth.service";
export * from "./session.service";

// Re-export individual API functions for mutation hooks
import {
  registerApi,
  loginApi,
  logoutApi,
  refreshTokenApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  updateProfileApi,
  uploadAvatarApi,
  deleteAccountApi,
} from "../api/auth.api";

export const login = loginApi;
export const register = registerApi;
export const logout = logoutApi;
export const refreshToken = refreshTokenApi;
export const forgotPassword = forgotPasswordApi;
export const resetPassword = resetPasswordApi;
export const changePassword = changePasswordApi;
export const updateProfile = updateProfileApi;
export const uploadAvatar = uploadAvatarApi;
export const deleteAccount = deleteAccountApi;

