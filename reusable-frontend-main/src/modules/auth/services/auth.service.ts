import {
  loginApi,
  registerApi,
  forgotPasswordApi,
  resetPasswordApi,
  logoutApi,
  refreshTokenApi,
  currentUserApi,
  changePasswordApi,
  updateProfileApi,
  uploadAvatarApi,
} from "../api/auth.api";

export const authService = {
  login: loginApi,
  register: registerApi,
  forgotPassword: forgotPasswordApi,
  resetPassword: resetPasswordApi,
  changePassword: changePasswordApi,
  updateProfile: updateProfileApi,
  uploadAvatar: uploadAvatarApi,
  logout: logoutApi,
  refreshToken: refreshTokenApi,
  getCurrentUser: currentUserApi,
  getSession: currentUserApi,
};
