import "dotenv/config";
import app from "./app.js";
import Dbconnection from "./db/index.js";
import { validateEnvironment } from "./config/env.js";
import { startTempCleanup } from "./service/temp-cleanup.service.js";
import { logger } from "./utils/logger.js";
import { createGracefulShutdown } from "./utils/shutdown.js";
import { setAcceptingTraffic } from "./utils/lifecycle.js";

const port = Number(process.env.PORT) || 5000;

let server;
let stopTempCleanup;

try {
  validateEnvironment();
  await Dbconnection();
  stopTempCleanup = startTempCleanup();

  server = app.listen(port, () => {
    const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_IDS);
    logger.info("api_started", {
      port,
      environment: process.env.NODE_ENV || "development",
      google_oauth: googleConfigured ? "configured" : "not_configured",
      google_oauth_hint: googleConfigured
        ? undefined
        : "Set GOOGLE_CLIENT_ID in backend .env and restart the server to enable Google sign-in",
    });
    setAcceptingTraffic(true);
  });

  const shutdown = createGracefulShutdown({ server, stopTempCleanup });
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
} catch (error) {
  logger.error("server_startup_failed", { error });
  process.exit(1);
}
