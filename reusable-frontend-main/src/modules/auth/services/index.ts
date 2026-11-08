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
  verifyEmailApi,
  resendVerifyEmailApi,
  googleLoginApi,
  linkGoogleApi,
  unlinkGoogleApi,
  activeSessionsApi,
  revokeSessionApi,
  revokeAllExceptCurrentApi,
  restoreAccountApi,
  changeEmailApi,
  verifyEmailChangeApi,
  deactivateAccountApi,
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
export const verifyEmail = verifyEmailApi;
export const resendVerifyEmail = resendVerifyEmailApi;
export const googleLogin = googleLoginApi;
export const linkGoogle = linkGoogleApi;
export const unlinkGoogle = unlinkGoogleApi;
export const activeSessions = activeSessionsApi;
export const revokeSession = revokeSessionApi;
export const revokeAllExceptCurrent = revokeAllExceptCurrentApi;
export const restoreAccount = restoreAccountApi;
export const changeEmail = changeEmailApi;
export const verifyEmailChange = verifyEmailChangeApi;
export const deactivateAccount = deactivateAccountApi;

