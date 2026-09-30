/**
 * Feature registry.
 *
 * Core modules are reusable across MERN applications. Add domain modules
 * under this directory without changing shared infrastructure.
 */
export * from "./auth";
export * from "./users";
export * from "./roles";
export * from "./notifications";
export * from "./media";
export * from "./payments";
export * from "./dashboard";
export * from "./settings";
export * from "./audit-logs";
export * from "./_template";

export * from "./announcements";
export * from "./events";
export * from "./coupons";
export * from "./orders";
export * from "./profile";

// Explicit re-exports to resolve ambiguity with `export *` above.
export { type UserRole } from "./users";
export { useRolesQuery } from "./roles";
export { type PaymentStatus } from "./payments";
export { useDeleteAccountMutation, useUpdateProfileMutation } from "./profile";
