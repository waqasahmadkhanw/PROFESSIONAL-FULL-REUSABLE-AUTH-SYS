"use client";

import { useState } from "react";
import { useMyNotificationsQuery } from "../queries";
import { useMarkAllReadMutation, useMarkAsReadMutation, useDeleteNotificationMutation } from "../mutations";
import { Button } from "@/shared/components/ui/Button";
import { Pagination } from "@/shared/components/navigation/Pagination";

export function MyNotificationsPage() {
  const [page, setPage] = useState(1);
  const query = useMyNotificationsQuery({ page, limit: 10 });
  const markAll = useMarkAllReadMutation();
  const markRead = useMarkAsReadMutation();
  const remove = useDeleteNotificationMutation();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your personal notifications from the backend.
          </p>
        </div>
        <Button
          variant="secondary"
          loading={markAll.isPending}
          disabled={markAll.isPending || (query.data?.unreadCount ?? 0) === 0}
          onClick={() => markAll.mutate()}
        >
          Mark all read
        </Button>
      </header>

      <section className="space-y-3">
        {query.isLoading ? (
          <p className="p-8 text-sm text-slate-500">Loading notifications…</p>
        ) : query.isError ? (
          <p className="p-8 text-sm text-red-600">
            {query.error instanceof Error ? query.error.message : "Unable to load notifications."}
          </p>
        ) : (
          <>
            {query.data?.notifications.map((notification) => (
              <article
                key={notification._id}
                className={`rounded-2xl border p-4 dark:border-slate-800 ${
                  notification.isRead
                    ? "bg-white dark:bg-slate-900"
                    : "bg-indigo-50/60 dark:bg-indigo-950/30"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-semibold">{notification.title}</h2>
                    {notification.message && (
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                        {notification.message}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        loading={markRead.isPending && markRead.variables === notification._id}
                        onClick={() => markRead.mutate(notification._id)}
                      >
                        Mark read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      loading={remove.isPending && remove.variables === notification._id}
                      onClick={() => remove.mutate(notification._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}

            {!query.data?.notifications.length && (
              <p className="rounded-2xl border p-8 text-center text-sm text-slate-500 dark:border-slate-800">
                No notifications found.
              </p>
            )}

            {query.data && query.data.totalPages > 1 && (
              <div className="flex justify-end">
                <Pagination
                  page={page}
                  totalPages={query.data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default MyNotificationsPage;
