"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Filter, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { EmptyState, ErrorState, Loading } from "@/shared/components/feedback";
import { useToast } from "@/shared/components/ui/Toast/useToast";
import { useNotifications } from "../hooks";
import { NotificationDeleteDialog, NotificationDetailModal, NotificationSendModal, NotificationsTable } from "../components";
import type { AppNotification } from "../types";

const isRecent = (date: string) => Date.now() - new Date(date).getTime() <= 7 * 24 * 60 * 60 * 1000;

/** Premium presentation layer for the existing notification inbox and mutations. */
export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AppNotification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppNotification | null>(null);
  const [status, setStatus] = useState<"all" | "unread">("all");

  const { data, isLoading, isError, refetch, unreadCount, markAllRead, markAsRead, isMutating } = useNotifications({ page, limit: 20, unread: status === "unread" ? true : undefined });
  const toast = useToast();
  const pathname = usePathname();
  const canSend = pathname.startsWith("/admin/");

  const filteredNotifications = data?.notifications ?? [];

  const total = data?.total ?? 0;
  const hasFilters = status !== "all";

  const handleView = (notification: AppNotification) => { setSelected(notification); setDetailOpen(true); };
  const handleMarkRead = async (id: string) => {
    try { await markAsRead(id); toast.success("Marked as read"); }
    catch { toast.error("Failed to mark as read"); }
  };
  const handleMarkAllRead = async () => {
    try { await markAllRead(); toast.success("All notifications marked as read"); }
    catch { toast.error("Failed to mark all as read"); }
  };
  const clearFilters = () => { setStatus("all"); setPage(1); };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"><span>Dashboard</span><ChevronRight className="h-3.5 w-3.5" /><span className="text-violet-700 dark:text-violet-300">Notifications</span></nav><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">Notifications</h1><p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Stay up to date with messages, activity, and important account alerts.</p></div>
          <div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => refetch()}>Refresh</Button><Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={handleMarkAllRead} disabled={isMutating || unreadCount === 0}>Mark all as read</Button>{canSend && <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setSendOpen(true)} className="bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500">Send notification</Button>}</div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total notifications", total, "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10"],
            ["Unread", unreadCount, "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10"],
            ["Read", Math.max(0, total - unreadCount), "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10"],
            ["System alerts · page", (data?.notifications ?? []).filter((item) => item.type === "system").length, "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10"],
            ["Recent · 7 days · page", (data?.notifications ?? []).filter((item) => isRecent(item.createdAt)).length, "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/10"],
          ].map(([label, value, color]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p><span className={`grid h-8 w-8 place-items-center rounded-xl ${color}`}><Bell className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p></div>)}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Inbox filter</h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Filtering is performed by the backend so pagination stays accurate.</p>
            </div>
            <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} aria-label="Filter notifications" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
                          </select>
            {hasFilters && <button type="button" onClick={() => { setStatus("all"); setPage(1); }} className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-semibold text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10">Clear</button>}
          </div>
        </section>

        {unreadCount > 0 && <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-200"><Bell className="h-4 w-4 shrink-0" /><span>You have <strong>{unreadCount}</strong> unread notification{unreadCount === 1 ? "" : "s"}.</span></div>}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><h2 className="font-bold text-slate-900 dark:text-white">Notification inbox</h2><p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{hasFilters ? `${filteredNotifications.length} matching notification${filteredNotifications.length === 1 ? "" : "s"} on this page` : "Your latest account activity and alerts. Totals are global; system/recent cards are for the current page."}</p></div><Filter className="h-5 w-5 text-violet-600 dark:text-violet-300" /></div>
          {isLoading ? <Loading /> : isError ? <ErrorState onRetry={() => refetch()} /> : !data || data.notifications.length === 0 ? <EmptyState title="No notifications" description="Notifications sent to you will appear here." /> : filteredNotifications.length === 0 ? <EmptyState title="No matching notifications" description="Try clearing or adjusting your filters." action={<button type="button" onClick={clearFilters} className="mt-3 text-sm font-semibold text-violet-700 dark:text-violet-300">Clear filters</button>} /> : <NotificationsTable notifications={filteredNotifications} onView={handleView} onMarkRead={handleMarkRead} onDelete={setDeleteTarget} />}
          {data && data.totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800"><p className="text-sm text-slate-500 dark:text-slate-400">Page {data.currentPage} of {data.totalPages}</p><div className="flex gap-2"><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"><ChevronLeft className="h-4 w-4" /></button><button type="button" aria-label="Next page" disabled={page >= data.totalPages} onClick={() => setPage((current) => current + 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"><ChevronRight className="h-4 w-4" /></button></div></div>}
        </section>
      </div>

      <NotificationDetailModal notification={selected} onClose={() => setDetailOpen(false)} />
      <NotificationSendModal open={sendOpen} onClose={() => setSendOpen(false)} />
      <NotificationDeleteDialog notification={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </main>
  );
}
