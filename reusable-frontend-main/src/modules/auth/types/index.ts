export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string | null;
  provider?: string;
  isActivated?: boolean;
  roles?: string[];
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  phone?: string;
  profession?: string;
  address?: string;
  socialLinks?: Record<string, string>;
  [key: string]: unknown;
}

export interface LoginResponse { user: AuthUser; }
export type CurrentUserResponse = AuthUser;
export type RegisterResponse = AuthUser;
export interface RefreshTokenResponse { message?: string; }
export interface LogoutResponse { message?: string; }
export interface ForgotPasswordResponse { message?: string; }
export interface ResetPasswordResponse { message?: string; }
export interface ChangePasswordResponse { message?: string; }
export type UpdateProfileResponse = AuthUser;
export interface UploadAvatarResponse { avatar: string; avatarPublicId?: string; }
export interface DeleteAccountResponse { message?: string; }
export interface VerifyEmailResponse { message?: string; }
export interface ResendVerifyEmailResponse { message?: string; }
export interface GoogleLoginResponse { user: AuthUser; message?: string; }
export interface LinkGoogleResponse { message?: string; }
export interface UnlinkGoogleResponse { message?: string; }
export interface ActiveSessionsResponse { sessions: AuthSession[]; }
export interface RevokeSessionResponse { message?: string; }
export interface RevokeAllExceptCurrentResponse { message?: string; }
export interface RestoreAccountResponse { message?: string; }
export interface ChangeEmailResponse { message?: string; }
export interface VerifyEmailChangeResponse { message?: string; }
export interface DeactivateAccountResponse { message?: string; }

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { name: string; email: string; password: string; }
export interface ForgotPasswordRequest { email: string; }
export interface ResetPasswordRequest { token: string; password: string; }
export type RefreshTokenRequest = void;
export type LogoutRequest = void;
export interface ChangePasswordRequest { oldPassword: string; newPassword: string; }
export type UpdateProfileRequest = Record<string, unknown>;
export interface UploadAvatarRequest { avatar: File; }
export interface DeleteAccountRequest { password?: string; }
export interface VerifyEmailRequest { token: string; }
export interface ResendVerifyEmailRequest { email: string; }
export interface GoogleLoginRequest { credential: string; }
export interface LinkGoogleRequest { credential: string; }
export interface UnlinkGoogleRequest { password?: string; }
export interface RevokeSessionRequest { sessionId: string; }
export interface RevokeAllExceptCurrentRequest { password?: string; }
export interface RestoreAccountRequest { token: string; }
export interface ChangeEmailRequest { newEmail: string; password: string; }
export interface VerifyEmailChangeRequest { token: string; }
export interface DeactivateAccountRequest { password: string; }

export type LoginFormValues = LoginRequest;
export type RegisterFormValues = RegisterRequest & { confirmPassword?: string };
export type ForgotPasswordFormValues = ForgotPasswordRequest;
export type ResetPasswordFormValues = ResetPasswordRequest & { confirmPassword?: string };
export type ChangePasswordFormValues = ChangePasswordRequest & { confirmPassword?: string };

export type PublicUser = Pick<AuthUser, "id" | "name" | "avatar">;
export type UserProfile = AuthUser;

export interface AuthSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  createdAt: string;
}
