"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Megaphone,
  ShoppingBag,
  TicketPercent,
  CreditCard,
  FileImage,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/shared/lib";
import { hasPermission } from "@/modules/auth/utils/auth.permission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import type { AuthUser } from "@/modules/auth/types";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Identity",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, permission: PERMISSIONS.READ_USERS },
      { href: "/admin/roles", label: "Roles & Permissions", icon: Shield, permission: PERMISSIONS.MANAGE_ROLES },
    ],
  },
  {
    label: "Content & Commerce",
    items: [
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone, permission: PERMISSIONS.MANAGE_ANNOUNCEMENTS },
      { href: "/admin/events", label: "Events", icon: CalendarDays, permission: PERMISSIONS.MANAGE_EVENTS },
      { href: "/admin/coupons", label: "Coupons", icon: TicketPercent, permission: PERMISSIONS.MANAGE_COUPONS },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag, permission: PERMISSIONS.MANAGE_PAYMENTS },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Bell, permission: PERMISSIONS.MANAGE_NOTIFICATIONS },
      { href: "/admin/media", label: "Media", icon: FileImage, permission: PERMISSIONS.MANAGE_MEDIA },
      { href: "/admin/payments", label: "Payments", icon: CreditCard, permission: PERMISSIONS.MANAGE_PAYMENTS },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText, permission: PERMISSIONS.VIEW_ACTIVITY_LOGS },
      { href: "/admin/settings", label: "Settings", icon: Settings, permission: PERMISSIONS.MANAGE_SETTINGS },
    ],
  },
];

interface SidebarProps {
  pathname: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isDesktopCollapsed: boolean;
  toggleDesktopCollapsed: () => void;
  hasHydratedCollapsePref: boolean;
  currentUser?: AuthUser | null;
  allowAll?: boolean;
}

export function Sidebar({
  pathname,
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktopCollapsed,
  toggleDesktopCollapsed,
  hasHydratedCollapsePref,
  currentUser,
  allowAll = false,
}: SidebarProps) {
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const content = (
    <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => !item.permission || allowAll || hasPermission(currentUser, item.permission));
          if (visibleItems.length === 0) return null;
          return (
          <div key={section.label} className="mb-6">
            {!isDesktopCollapsed && (
              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isDesktopCollapsed ? item.label : undefined}
                    onClick={() => setIsSidebarOpen(false)}
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
          );
        })}
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
