"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/shared/store";
import { clearCsrfToken } from "@/shared/api";
import { AUTH_QUERY_KEYS } from "../constants/auth.query-keys";
import { logout } from "../store";
import { publishAuthSync, subscribeAuthSync, type AuthSyncEvent } from "../utils/auth.sync";

/**
 * Keeps the server-authoritative cookie session, React Query and Redux UI
 * state synchronized, including logout/session expiry in another tab.
 */
export function useAuthSynchronization(): void {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const synchronize = (event: AuthSyncEvent) => {
      if (event === "login") {
        void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.CURRENT_USER });
        return;
      }

      clearCsrfToken();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.CURRENT_USER });
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.SESSION });
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.PERMISSIONS });
      dispatch(logout());
    };

    const unsubscribe = subscribeAuthSync(synchronize);

    const onExpired = () => {
      synchronize("session-expired");
      publishAuthSync("session-expired");
    };

    window.addEventListener("app:auth-session-expired", onExpired);
    return () => {
      unsubscribe();
      window.removeEventListener("app:auth-session-expired", onExpired);
    };
  }, [dispatch, queryClient]);
}

