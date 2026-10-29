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
  icon: React.ElementType;
}

export interface UserNavSection {
  label: string;
  items: UserNavItem[];
}

export const userNavSections: UserNavSection[] = [
  { label: "Main", items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: UserRound },
      { href: "/change-password", label: "Change Password", icon: Settings },
    ],
  },
  {
    label: "Activity",
    items: [
      { href: "/orders", label: "My Orders", icon: ShoppingBag },
      { href: "/payments", label: "My Payments", icon: CreditCard },
      { href: "/events", label: "Events", icon: CalendarDays },
      { href: "/announcements", label: "Announcements", icon: Megaphone },
      { href: "/notifications", label: "Notifications", icon: Bell },
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
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {userNavSections.map((section) => (
          <div key={section.label} className="mb-6">
            {!isDesktopCollapsed && (
              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isDesktopCollapsed ? item.label : undefined}
                    prefetch={true}
                    onClick={handleLinkClick}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                      isDesktopCollapsed && "justify-center px-0",
                      active
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isDesktopCollapsed && <span>{item.label}</span>}
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
          "sticky top-16 z-30 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-950",
          hasHydratedCollapsePref && "transition-[width] duration-200",
          isDesktopCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex w-full flex-col">
          {content}
          <button
            type="button"
            onClick={toggleDesktopCollapsed}
            className="m-2 inline-flex h-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={isDesktopCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {isDesktopCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative z-10 h-full w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
