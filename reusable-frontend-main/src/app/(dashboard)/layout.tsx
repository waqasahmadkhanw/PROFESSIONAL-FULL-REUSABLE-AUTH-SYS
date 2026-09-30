"use client";

import { ReactNode } from "react";
import { useAuthGuard } from "@/modules/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * This used to be the ONLY layout for both /admin/* and /profile, and
 * carried the admin-only role guard + full sidebar chrome. That meant
 * a logged-in user visiting their own /profile page
 * was redirected to /403, since the guard required an admin role.
 *
 * The sidebar/hamburger/admin-role-guard now lives in
 * src/app/(dashboard)/admin/layout.tsx, scoped to /admin/* only. This
 * outer layout just requires *any* authenticated user, which is all
 * /profile should need.
 */
export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { isLoading, isAuthorized, error } = useAuthGuard();

  // The redirect itself happens inside useAuthGuard's effect, but that
  // effect only *starts* the navigation — it doesn't stop this component
  // from rendering children in the same tick. Without gating on the
  // result here, an unauthenticated visitor briefly sees the real
  // /profile content before router.replace("/login") takes effect.
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking session…</div>;
  }
  if (error) {
    return <div className="flex min-h-screen items-center justify-center p-6 text-sm text-muted-foreground">Unable to verify your session.</div>;
  }
  if (!isAuthorized) return null;

  return <>{children}</>;
}
