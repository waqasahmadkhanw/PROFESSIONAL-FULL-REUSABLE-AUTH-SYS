// ============================================
// Generic User Management Types
// ============================================

export type UserRole = string;

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarPublicId?: string;
  isActivated: boolean;
  bio?: string;
  phone?: string;
  role: UserRole;
  permissions?: string[];
  createdAt: string;
  profession?: string;
  address?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  updatedAt: string;
}

export interface UsersListResponse {
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  users: AdminUser[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  role?: UserRole;
  isActivated?: boolean;
}

export interface ChangeRoleRequest {
  role: UserRole;
}

export interface ChangeRoleResponse {
  id: string;
  role: UserRole;
}

export interface ToggleActivationResponse {
  id: string;
  isActivated: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  [key: string]: unknown;
}
