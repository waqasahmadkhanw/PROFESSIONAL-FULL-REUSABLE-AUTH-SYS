type NodeEnv = "development" | "production" | "test";

const nodeEnv = (process.env.NODE_ENV as NodeEnv | undefined) ?? "development";
const isProduction = nodeEnv === "production";

const required = (key: string, fallback?: string) => {
  const value = process.env[key] ?? (isProduction ? undefined : fallback);
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const booleanEnv = (key: string, fallback: boolean) => {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized !== "true" && normalized !== "false") {
    throw new Error(`${key} must be either true or false`);
  }
  return normalized === "true";
};

const positiveNumber = (key: string, raw: string | undefined, fallback: number) => {
  const value = Number(raw ?? fallback);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a positive number`);
  }
  return value;
};

const validUrl = (key: string, value: string) => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL`);
  }
  if (!parsed.protocol || !parsed.host) throw new Error(`${key} must be a valid URL`);
  if (isProduction && parsed.protocol !== "https:") {
    throw new Error(`${key} must use HTTPS in production`);
  }
  return value.replace(/\/$/, "");
};

const apiUrl = validUrl("NEXT_PUBLIC_API_URL", required("NEXT_PUBLIC_API_URL", "http://localhost:5000/api"));
const siteUrl = validUrl("NEXT_PUBLIC_SITE_URL", required("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"));
const timeout = positiveNumber("NEXT_PUBLIC_API_TIMEOUT_MS", process.env.NEXT_PUBLIC_API_TIMEOUT_MS, 30000);
const maxUploadSize = positiveNumber("NEXT_PUBLIC_MAX_UPLOAD_SIZE", process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE, 10 * 1024 * 1024);

export const env = Object.freeze({
  NODE_ENV: nodeEnv,
  API_URL: apiUrl,
  SITE_URL: siteUrl,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "MERN Application",
  APP_DESCRIPTION:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
    "Production-ready reusable MERN frontend template.",
  API_TIMEOUT_MS: timeout,
  MAX_UPLOAD_SIZE: maxUploadSize,
  FEATURES: Object.freeze({
    AUTH: booleanEnv("NEXT_PUBLIC_FEATURE_AUTH", true),
    NOTIFICATIONS: booleanEnv("NEXT_PUBLIC_FEATURE_NOTIFICATIONS", true),
    FILE_UPLOADS: booleanEnv("NEXT_PUBLIC_FEATURE_FILE_UPLOADS", true),
    PAYMENTS: booleanEnv("NEXT_PUBLIC_FEATURE_PAYMENTS", true),
    STRIPE: booleanEnv("NEXT_PUBLIC_FEATURE_STRIPE", false),
    EASYPAISA: booleanEnv("NEXT_PUBLIC_FEATURE_EASYPAISA", false),
    JAZZCASH: booleanEnv("NEXT_PUBLIC_FEATURE_JAZZCASH", false),
  }),
  IS_DEV: nodeEnv === "development",
  IS_PROD: isProduction,
  IS_TEST: nodeEnv === "test",
} as const);

export default env;
