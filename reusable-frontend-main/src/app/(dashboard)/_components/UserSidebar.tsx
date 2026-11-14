"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CreditCard,
  Home,
  LayoutDashboard,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { cn } from "@/shared/lib";
import type { AuthUser } from "@/modules/auth/types";

export interface UserNavItem {
  href: string;
  label: string;
  description?: string;
  icon: React.ElementType;
}

export interface UserNavSection {
  label: string;
  items: UserNavItem[];
}

export const userNavSections: UserNavSection[] = [
  { label: "Main", items: [{ href: "/dashboard", label: "Dashboard", description: "Overview of your account and activity", icon: LayoutDashboard }] },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", description: "Manage your personal details and avatar", icon: UserRound },
      { href: "/change-password", label: "Change Password", description: "Update your account password securely", icon: Settings },
    ],
  },
  {
    label: "Activity",
    items: [
      { href: "/orders", label: "My Orders", description: "View and manage your orders", icon: ShoppingBag },
      { href: "/payments", label: "My Payments", description: "View your payment history", icon: CreditCard },
      { href: "/events", label: "Events", description: "Browse upcoming and past events", icon: CalendarDays },
      { href: "/announcements", label: "Announcements", description: "Read latest site announcements", icon: Megaphone },
      { href: "/notifications", label: "Notifications", description: "View your notifications", icon: Bell },
    ],
  },
];

interface UserSidebarProps {
  pathname: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isDesktopCollapsed: boolean;
  toggleDesktopCollapsed: () => void;
  hasHydratedCollapsePref: boolean;
  currentUser?: AuthUser | null;
}

export function UserSidebar({
  pathname,
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktopCollapsed,
  toggleDesktopCollapsed,
  hasHydratedCollapsePref,
}: UserSidebarProps) {
  const isActive = useCallback((href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href), [pathname]);

  const handleLinkClick = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);

  const content = (
    <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800">
        {!isDesktopCollapsed && (
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </Link>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {userNavSections.map((section) => (
          <div key={section.label} className="mb-6">
            {!isDesktopCollapsed && (
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isDesktopCollapsed ? item.label : undefined}
                    prefetch={false}
                    onClick={handleLinkClick}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-all duration-200",
                      isDesktopCollapsed && "justify-center px-0",
                      active
                        ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800/80 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-slate-900 dark:text-white" : "text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white")} />
                    {!isDesktopCollapsed && (
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] shrink-0 border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full w-72 flex-col">
          {content}
        </div>
      </aside>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
