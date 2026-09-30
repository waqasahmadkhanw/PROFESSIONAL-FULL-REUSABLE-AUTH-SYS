"use client";

import Link from "next/link";
import { ArrowRight, Bell, CalendarDays, CreditCard, Megaphone, Settings, ShieldCheck, UserRound } from "lucide-react";

import { useCurrentUserQuery } from "@/modules/auth";
import { Loading } from "@/shared/components/feedback";

const links = [
  { href: "/profile", label: "My Profile", description: "Update your personal details, bio and avatar.", icon: UserRound },
  { href: "/change-password", label: "Change Password", description: "Keep your account secure with a new password.", icon: ShieldCheck },
  { href: "/admin", label: "Admin Console", description: "Manage users, roles, content and commerce.", icon: Settings },
  { href: "/orders", label: "My Orders", description: "View your orders and cancel eligible pending orders.", icon: CreditCard },
  { href: "/events", label: "Events", description: "View events available to your account.", icon: CalendarDays },
  { href: "/notifications", label: "Notifications", description: "Read and manage your personal notifications.", icon: Bell },
  { href: "/announcements", label: "Announcements", description: "Read published announcements available to you.", icon: Megaphone },
  { href: "/payments", label: "My Payments", description: "Review your payment history.", icon: CreditCard },
];

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Dashboard</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You are signed in{user?.email ? ` as ${user.email}` : ""}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {links.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
          >
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="flex items-center gap-1.5 font-semibold">
              {label}
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
