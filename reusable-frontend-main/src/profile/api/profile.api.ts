export interface ChangePasswordRequest { oldPassword: string; newPassword: string; }
export type UpdateProfileRequest = Record<string, unknown>;
export interface UploadAvatarRequest { avatar: File; }
export interface DeleteAccountRequest {
  password: string;
  confirm: "DELETE";
}
export interface VerifyEmailRequest { token: string; }
export interface ResendVerifyEmailRequest { email: string; }
export interface GoogleLoginRequest { credential: string; }
export interface LinkGoogleRequest { credential: string; }
export interface UnlinkGoogleRequest { password?: string; }
export interface RevokeSessionRequest { sessionId: string; }
export interface RevokeAllExceptCurrentRequest { password?: string; }
export interface RestoreAccountRequest { email: string; password: string; }
export interface RestoreAccountResponse { message?: string; user?: unknown }