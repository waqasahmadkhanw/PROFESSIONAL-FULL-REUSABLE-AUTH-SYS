export type UserRole = string;

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  roles?: UserRole[];
  permissions?: string[];
  avatarUrl?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  isAuthenticated: boolean;
}
