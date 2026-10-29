"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Menu, Moon, Settings, Sun, User, X } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useUnreadCountQuery } from "@/modules/notifications";
import { Avatar } from "@/shared/components/ui";

interface UserNavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser?: { name?: string; email?: string; role?: string; avatar?: string | null } | null;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

export function UserNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  currentUser,
  handleLogout,
  isLoggingOut,
}: UserNavbarProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const { data } = useUnreadCountQuery();
  const [profileOpen, setProfileOpen] = useState(false);
  const isDark = resolvedTheme === "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsSidebarOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">MERN App</Link>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Link
          href="/notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {!!data?.unreadCount && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
              {data.unreadCount > 99 ? "99+" : data.unreadCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Avatar src={currentUser?.avatar ?? undefined} name={currentUser?.name} size="sm" className="h-7 w-7" />
            <span className="hidden max-w-28 truncate sm:block">{currentUser?.name ?? "Account"}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <Link href="/profile" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
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
