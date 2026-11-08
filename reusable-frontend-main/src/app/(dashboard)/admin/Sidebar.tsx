"use client";

import React, { useCallback, useMemo } from "react";
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
  Info,
  Mail,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/shared/lib";
import { hasPermission } from "@/modules/auth/utils/auth.permission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import type { AuthUser } from "@/modules/auth/types";

export interface NavItem {
  href: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  permission?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", description: "View key metrics and recent activity", icon: LayoutDashboard }] },
  {
    label: "Identity",
    items: [
      { href: "/admin/users", label: "Users", description: "Manage user accounts and profiles", icon: Users, permission: PERMISSIONS.READ_USERS },
      { href: "/admin/roles", label: "Roles & Permissions", description: "Configure access control and roles", icon: Shield, permission: PERMISSIONS.MANAGE_ROLES },
    ],
  },
  {
    label: "Content & Commerce",
    items: [
      { href: "/admin/announcements", label: "Announcements", description: "Publish site-wide announcements", icon: Megaphone, permission: PERMISSIONS.MANAGE_ANNOUNCEMENTS },
      { href: "/admin/events", label: "Events", description: "Manage upcoming and past events", icon: CalendarDays, permission: PERMISSIONS.MANAGE_EVENTS },
      { href: "/admin/coupons", label: "Coupons", description: "Create and track discount codes", icon: TicketPercent, permission: PERMISSIONS.MANAGE_COUPONS },
      { href: "/admin/orders", label: "Orders", description: "View and manage customer orders", icon: ShoppingBag, permission: PERMISSIONS.MANAGE_PAYMENTS },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/notifications", label: "Notifications", description: "Manage system notifications", icon: Bell, permission: PERMISSIONS.MANAGE_NOTIFICATIONS },
      { href: "/admin/media", label: "Media", description: "Upload and organize media files", icon: FileImage, permission: PERMISSIONS.MANAGE_MEDIA },
      { href: "/admin/payments", label: "Payments", description: "Process and track payments", icon: CreditCard, permission: PERMISSIONS.MANAGE_PAYMENTS },
      { href: "/admin/audit-logs", label: "Audit Logs", description: "Review system activity logs", icon: ScrollText, permission: PERMISSIONS.VIEW_ACTIVITY_LOGS },
      { href: "/admin/settings", label: "Settings", description: "Configure application settings", icon: Settings, permission: PERMISSIONS.MANAGE_SETTINGS },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/about", label: "About Us", description: "Company information page", icon: Info },
      { href: "/contact", label: "Contact Us", description: "Contact form page", icon: Mail },
      { href: "/privacy", label: "Privacy Policy", description: "Privacy policy page", icon: ShieldCheck },
      { href: "/terms", label: "Terms of Service", description: "Terms of service page", icon: FileText },
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
  const isActive = useCallback((href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href), [pathname]);

  const handleLinkClick = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);

  const content = (
    <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800">
        {!isDesktopCollapsed && (
          <Link href="/admin" className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </Link>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => !item.permission || allowAll || hasPermission(currentUser, item.permission));
          if (visibleItems.length === 0) return null;
          return (
          <div key={section.label} className="mb-6">
            {!isDesktopCollapsed && (
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {visibleItems.map((item) => {
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
          );
        })}
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
