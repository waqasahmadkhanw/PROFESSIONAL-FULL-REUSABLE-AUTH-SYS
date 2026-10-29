"use client";

import { ReactNode, useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthGuard, useCurrentUserQuery, useLogout } from "@/modules/auth";
import { UserNavbar } from "./_components/UserNavbar";
import { UserSidebar, userNavSections } from "./_components/UserSidebar";
import { storage } from "@/shared/lib/storage";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout for authenticated users (non-admin routes like /profile, /dashboard, /orders, etc.).
 * Requires any authenticated user. Uses dedicated user navbar and sidebar.
 */
export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthorized, error } = useAuthGuard();
  const { data: currentUser } = useCurrentUserQuery();
  const { logout, isPending: isLoggingOut } = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() =>
    storage.get<boolean>("user-sidebar-collapsed") === true
  );
  const [hydrated] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const activeItem = useMemo(() =>
    userNavSections.flatMap((section) => section.items)
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)),
    [pathname]
  );

  const toggleDesktopCollapsed = () => {
    setIsDesktopCollapsed((current) => {
      const next = !current;
      storage.set("user-sidebar-collapsed", next);
      return next;
    });
  };

  const handleLogout = async () => {
    try { await logout(); } finally { router.replace("/login"); }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500 dark:text-slate-400">Checking session…</div>;
  }
  if (error) {
    return <div className="flex min-h-screen items-center justify-center p-6 text-sm text-slate-500 dark:text-slate-400">Unable to verify your session.</div>;
  }
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <UserNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      <div className="flex min-h-screen pt-16">
        <UserSidebar
          pathname={pathname}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDesktopCollapsed={isDesktopCollapsed}
          toggleDesktopCollapsed={toggleDesktopCollapsed}
          hasHydratedCollapsePref={hydrated}
          currentUser={currentUser}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
            {activeItem && (
              <header className="mb-6 border-b border-slate-200 pb-5 dark:border-slate-800">
                <h1 className="text-2xl font-semibold tracking-tight">{activeItem.label}</h1>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Manage your account and activities.
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
