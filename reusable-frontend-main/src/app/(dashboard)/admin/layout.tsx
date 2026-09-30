"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard, useCurrentUserQuery, useLogout } from "@/modules/auth";
import { hasAnyPermission, hasPermission } from "@/modules/auth/utils/auth.permission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { Navbar } from "./Navbar";
import { Sidebar, navSections } from "./Sidebar";
import { storage } from "@/shared/lib/storage";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authGuard = useAuthGuard();
  const { data: currentUser } = useCurrentUserQuery();
  const { logout, isPending: isLoggingOut } = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const isAdminRole = currentUser?.role === "admin" || Boolean(currentUser?.roles?.includes("admin"));
  // Entry into the admin shell itself: any staff member with at least one
  // admin permission gets in (so they can see the sections the sidebar
  // filters in for them).
  const hasAdminAccess = isAdminRole || hasAnyPermission(currentUser, Object.values(PERMISSIONS));

  useEffect(() => {
    const saved = storage.get<boolean>("admin-sidebar-collapsed");
    setIsDesktopCollapsed(saved === true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const activeItem =
    navSections.flatMap((section) => section.items)
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href));

  // Route-level check: "has some admin permission" is only enough to get
  // into the shell — the page being viewed must match the specific
  // permission the sidebar already uses to decide whether to show its
  // link. Without this, a staff member with e.g. only MANAGE_MEDIA could
  // type /admin/users into the address bar and see it anyway, since the
  // sidebar only hides the *link*, it doesn't block the *route*.
  // Unmapped routes (like /admin itself) fall back to "any admin access".
  const isRouteAuthorized =
    isAdminRole ||
    (activeItem?.permission ? hasPermission(currentUser, activeItem.permission) : hasAdminAccess);

  const toggleDesktopCollapsed = () => {
    setIsDesktopCollapsed((current) => {
      const next = !current;
      storage.set("admin-sidebar-collapsed", next);
      return next;
    });
  };

  const handleLogout = async () => {
    try { await logout(); } finally { router.replace("/login"); }
  };

  useEffect(() => {
    if (authGuard.isAuthorized && currentUser && !isRouteAuthorized) {
      router.replace("/403");
    }
  }, [authGuard.isAuthorized, currentUser, isRouteAuthorized, router]);

  if (authGuard.isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking session…</div>;
  }
  if (authGuard.error) {
    return <div className="flex min-h-screen items-center justify-center p-6 text-sm text-muted-foreground">Unable to verify your session.</div>;
  }
  if (!authGuard.isAuthorized || !isRouteAuthorized) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      <div className="flex min-h-screen pt-[72px]">
        <Sidebar
          pathname={pathname}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDesktopCollapsed={isDesktopCollapsed}
          toggleDesktopCollapsed={toggleDesktopCollapsed}
          hasHydratedCollapsePref={hydrated}
          currentUser={currentUser}
          allowAll={isAdminRole}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {activeItem && (
              <header className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
                <h1 className="text-2xl font-semibold">{activeItem.label}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reusable administration and system management.
                </p>
              </header>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
