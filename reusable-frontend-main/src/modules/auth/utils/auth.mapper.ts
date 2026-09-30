import type { AuthUser, LoginResponse } from "../types";

export const mapUser = (data: Partial<AuthUser> & { _id?: string; socials?: Record<string, string> }): AuthUser => ({
  id: data.id ?? String(data._id ?? ""),
  _id: data._id,
  name: data.name ?? "",
  email: data.email ?? "",
  avatar: data.avatar ?? null,
  provider: data.provider ?? "local",
  isActivated: data.isActivated ?? true,
  roles: data.roles ?? (data.role ? [data.role] : []),
  role: data.role,
  permissions: data.permissions ?? [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  socialLinks: data.socialLinks ?? data.socials,
});

export const mapLoginResponse = (response: LoginResponse): LoginResponse => ({
  ...response,
  user: mapUser(response.user),
});
