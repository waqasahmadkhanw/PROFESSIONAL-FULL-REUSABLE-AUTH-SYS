"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Menu, Moon, Settings, Sun, User, X } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useUnreadCountQuery } from "@/modules/notifications";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser?: { name?: string; email?: string; role?: string; avatar?: string | null } | null;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

export function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
  currentUser,
  handleLogout,
  isLoggingOut,
}: NavbarProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const { data } = useUnreadCountQuery();
  const [profileOpen, setProfileOpen] = useState(false);
  const isDark = resolvedTheme === "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsSidebarOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border dark:border-slate-700"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link href="/admin" className="font-bold tracking-tight">MERN Admin</Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border dark:border-slate-700"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Link
          href="/admin/notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border dark:border-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {!!data?.unreadCount && (
            <span className="absolute right-1 top-1 min-w-4 rounded-full bg-red-500 px-1 text-center text-[9px] text-white">
              {data.unreadCount > 99 ? "99+" : data.unreadCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-slate-700"
          >
            <User className="h-4 w-4" />
            <span className="hidden max-w-28 truncate sm:block">{currentUser?.name ?? "Account"}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" /> {isLoggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
