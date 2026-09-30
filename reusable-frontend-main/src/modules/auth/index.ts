// Auth Module - Public API
// Public API for the reusable authentication feature

// Types
export type {
  ApiResponse,
  AuthUser,
  CurrentUserResponse,

  // Response DTOs
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  LogoutResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  UpdateProfileResponse,
  UploadAvatarResponse,
  DeleteAccountResponse,

  // Request DTOs
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  LogoutRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UploadAvatarRequest,
  DeleteAccountRequest,

  // Form Values
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  ChangePasswordFormValues,
} from "./types";

// Services
export * from "./services";

// Store
export { authReducer } from "./store";
export type { AuthState as StoreAuthState } from "./store";
export {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  logout,
} from "./store";
export {
  selectAuth,
  selectIsAuthenticated,
  selectUserId,
  selectAuthStatus,
  selectAuthError,
} from "./store";

// Hooks
export * from "./hooks";

// Components
export * from "./components";

// Pages
export * from "./pages";

// Mutations
export * from "./mutations";

// Queries
export * from "./queries";

// Utils
export * from "./utils";

// Validation
export * from "./validation";
