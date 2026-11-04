"use client";

import { ReactNode, useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard, useCurrentUserQuery, useLogout } from "@/modules/auth";
import { hasAnyPermission, hasPermission } from "@/modules/auth/utils/auth.permission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { Navbar } from "./Navbar";
import { Sidebar, navSections } from "./Sidebar";
import { storage } from "@/shared/lib/storage";
import { PublicFooter } from "@/shared/components/layout/PublicFooter";
import { cn } from "@/shared/lib";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authGuard = useAuthGuard();
  const { data: currentUser } = useCurrentUserQuery();
  const { logout, isPending: isLoggingOut } = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() =>
    storage.get<boolean>("admin-sidebar-collapsed") === true
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const isAdminRole = currentUser?.role === "admin" || Boolean(currentUser?.roles?.includes("admin"));
  const hasAdminAccess = useMemo(() => isAdminRole || hasAnyPermission(currentUser, Object.values(PERMISSIONS)), [isAdminRole, currentUser]);



  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const activeItem = useMemo(() =>
    navSections.flatMap((section) => section.items)
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)),
    [pathname]
  );

  const isRouteAuthorized = useMemo(() =>
    isAdminRole ||
    (activeItem?.permission ? hasPermission(currentUser, activeItem.permission) : hasAdminAccess),
    [isAdminRole, activeItem, currentUser, hasAdminAccess]
  );

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
    if (authGuard.isAuthorized && currentUser && !isRouteAuthorized && pathname.startsWith("/admin")) {
      router.replace("/403");
    }
  }, [authGuard.isAuthorized, currentUser, isRouteAuthorized, router, pathname]);

  if (authGuard.isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking session…</div>;
  }
  if (authGuard.error) {
    return <div className="flex min-h-screen items-center justify-center p-6 text-sm text-muted-foreground">Unable to verify your session.</div>;
  }
  if (!authGuard.isAuthorized || !isRouteAuthorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-50">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        isDesktopCollapsed={isDesktopCollapsed}
        toggleDesktopCollapsed={toggleDesktopCollapsed}
      />
      <div className="flex min-h-screen pt-16">
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
        <div className={cn("flex min-w-0 flex-1 flex-col transition-all duration-300")}>
          <main className={cn("relative z-10 min-w-0 flex-1 transition-all duration-300")}>
            <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
              {activeItem && (
                <header className="mb-6 border-b border-slate-200 pb-5 dark:border-slate-800">
                  <h1 className="text-2xl font-semibold tracking-tight">{activeItem.label}</h1>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    Reusable administration and system management.
                  </p>
                </header>
              )}
              {children}
            </div>
          </main>
          <PublicFooter />
        </div>
      </div>
    </div>
  );
}
