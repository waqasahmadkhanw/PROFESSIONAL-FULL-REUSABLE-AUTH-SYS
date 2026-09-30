"use client";

import { useState } from "react";
import { RefreshCw, ScrollText } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/Card";
import { EmptyState, ErrorState, Loading } from "@/shared/components/feedback";
import { Pagination } from "@/shared/components/navigation/Pagination";
import { PageHeader } from "@/shared/components/navigation/PageHeader";
import { useAuditLogsQuery } from "../queries";

const PAGE_SIZE = 20;

export function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const query = useAuditLogsQuery(page, PAGE_SIZE);
  const logs = query.data?.logs ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Review administrative actions, access changes and system-level activity logs."
        actions={<Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => query.refetch()}>Refresh</Button>}
      />
      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <Loading message="Loading audit logs..." />
          ) : query.isError ? (
            <ErrorState title="Failed to load audit logs" message={query.error.message} onRetry={() => query.refetch()} />
          ) : logs.length === 0 ? (
            <EmptyState icon={<ScrollText className="h-8 w-8 text-slate-300" />} title="No audit activity" description="Recent system activity will appear here once admin actions are recorded." />
          ) : (
            <div className="space-y-3 p-4">
              {logs.map((log) => (
                <Card key={log._id}>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{log.action ?? "System action"}</p>
                      <p className="mt-1 text-xs text-slate-400">{log.resource ?? "Unknown resource"} · {log.user?.name ?? log.user?.email ?? "System"}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>{log.method ?? "REQUEST"}</p>
                      <p>{log.statusCode ?? 200}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        {(query.data?.pagination?.pages ?? 1) > 1 && (
          <CardFooter>
            <Pagination page={page} totalPages={query.data?.pagination?.pages ?? 1} onPageChange={setPage} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
