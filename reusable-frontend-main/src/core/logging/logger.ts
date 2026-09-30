import { env } from "@/shared/config/env";

type LogMeta = Record<string, unknown>;

const write = (level: "debug" | "info" | "warn" | "error", message: string, meta?: LogMeta) => {
  // Keep production logs intentionally quiet. The backend owns structured
  // operational logging; the browser should not leak application data.
  if (!env.IS_DEV) return;
  const payload = meta ? [message, meta] : [message];
  console[level](...payload);
};

export const logger = {
  debug: (message: string, meta?: LogMeta) => write("debug", message, meta),
  info: (message: string, meta?: LogMeta) => write("info", message, meta),
  warn: (message: string, meta?: LogMeta) => write("warn", message, meta),
  error: (message: string, meta?: LogMeta) => write("error", message, meta),
};
