"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import { useActiveSessions, useRevokeSession, useRevokeAllExceptCurrent } from "@/modules/auth";
import { Button } from "@/shared/components/ui";
import { useToast } from "@/shared/components/ui/Toast";

export default function SessionsPage() {
  const router = useRouter();
  const { getActiveSessions, isPending: isLoading } = useActiveSessions();
  const { revokeSession, isPending: isRevoking } = useRevokeSession();
  const { revokeAllExceptCurrent, isPending: isRevokingAll } = useRevokeAllExceptCurrent();
  const { success, error } = useToast();

  const [sessions, setSessions] = useState<Array<{ id: string; device: string; ip: string; location: string; lastActive: string; isCurrent: boolean }>>([]);

  const loadSessions = useCallback(async () => {
    try {
      const response = await getActiveSessions();
      setSessions(response.sessions ?? []);
    } catch (err) {
      error((err as Error)?.message ?? "Failed to load sessions");
    }
  }, [getActiveSessions, error]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      success("Session revoked");
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (err) {
      error((err as Error)?.message ?? "Failed to revoke session");
    }
  };

  const handleRevokeAll = async () => {
    try {
      await revokeAllExceptCurrent();
      success("All other sessions revoked");
      setSessions(sessions.filter((s) => s.isCurrent));
    } catch (err) {
      error((err as Error)?.message ?? "Failed to revoke sessions");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <Button variant="secondary" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><ShieldCheck className="h-5 w-5" /></span>
            <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Active Sessions</h1><p className="text-sm text-slate-500 dark:text-slate-400">Manage your active sign-in sessions.</p></div>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No active sessions found.</p>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Device</th>
                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Location</th>
                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Last Active</th>
                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-900 dark:text-white">{session.device}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-white">{session.location}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{session.lastActive}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{session.isCurrent ? "Current" : "Active"}</span>
                      </td>
                      <td className="px-4 py-3">
                        {!session.isCurrent && (
                          <Button variant="outline" size="sm" onClick={() => handleRevoke(session.id)} disabled={isRevoking}>
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && sessions.length > 0 && (
            <Button variant="outline" className="mt-4" disabled={isRevokingAll} onClick={handleRevokeAll}>
              Revoke All Other Sessions
            </Button>
          )}
        </section>
      </div>
    </main>
  );
}
