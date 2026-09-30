"use client";

export type AuthSyncEvent = "login" | "logout" | "session-expired";

const CHANNEL_NAME = "app-auth-sync";
let channel: BroadcastChannel | null = null;

export function publishAuthSync(event: AuthSyncEvent): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof BroadcastChannel !== "undefined") {
      channel ??= new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ event });
    }
  } catch {
    // Cross-tab synchronization is best-effort; local session handling
    // remains authoritative through the HttpOnly backend cookie.
  }
}

export function subscribeAuthSync(handler: (event: AuthSyncEvent) => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onLocal = (event: Event) => {
    const detail = (event as CustomEvent<{ event?: AuthSyncEvent }>).detail;
    if (detail?.event) handler(detail.event);
  };

  window.addEventListener("app:auth-sync", onLocal);

  if (typeof BroadcastChannel === "undefined") {
    return () => window.removeEventListener("app:auth-sync", onLocal);
  }

  try {
    channel ??= new BroadcastChannel(CHANNEL_NAME);
    const onMessage = (message: MessageEvent<{ event?: AuthSyncEvent }>) => {
      if (message.data?.event) handler(message.data.event);
    };
    channel.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("app:auth-sync", onLocal);
      channel?.removeEventListener("message", onMessage);
    };
  } catch {
    return () => window.removeEventListener("app:auth-sync", onLocal);
  }
}

export function emitLocalAuthSync(event: AuthSyncEvent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app:auth-sync", { detail: { event } }));
}
