import type { Middleware } from "@reduxjs/toolkit";
import { env } from "@/shared/config/env";

const loggerMiddleware: Middleware = () => (next) => (action) => {
  if (env.IS_DEV) {
    // Do not log payloads in production. Development-only Redux tracing.
    console.debug("[Redux]", action);
  }

  return next(action);
};

export const middleware = [loggerMiddleware];
