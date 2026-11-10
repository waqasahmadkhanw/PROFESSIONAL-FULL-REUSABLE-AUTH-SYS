import { Session } from "../models/session.model.js";
import { Setting } from "../models/setting.model.js";
import { LoginAttempt } from "../models/loginAttempt.model.js";
import EmailService from "./email.service.js";
import { logger } from "../utils/logger.js";
import { recordAudit } from "./audit.service.js";

/**
 * Security service for account lockout, login attempt tracking, login-event
 * auditing, and new/suspicious login notifications.
 *
 * Configuration (env):
 * - LOGIN_LOCKOUT_MAX_ATTEMPTS (default 5)
 * - LOGIN_LOCKOUT_WINDOW_MS    (default 900000 / 15m)
 * - LOGIN_ALERTS_ENABLED       (default true; can also be set via Setting key security.login_alerts_enabled)
 * - SECURITY_LOGIN_EVENT_AUDIT  (default true)
 *
 * Notes:
 * - Detection is basic/heuristic (IP + coarse UA family). Do NOT use as an
 *   authentication factor or substitute for strong auth/MFA.
 * - Logs/audit details avoid sensitive data (no passwords, tokens, raw secrets).
 */

const toPositiveInt = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export const LOGIN_SECURITY = {
  maxAttempts: toPositiveInt(process.env.LOGIN_LOCKOUT_MAX_ATTEMPTS, 5),
  lockoutMs: toPositiveInt(process.env.LOGIN_LOCKOUT_WINDOW_MS, 15 * 60 * 1000),
  auditLoginEvents: String(process.env.SECURITY_LOGIN_EVENT_AUDIT ?? "true").toLowerCase() !== "false",
};

export const getLockoutRemainingMs = (identifier, attempts, lockoutMs = LOGIN_SECURITY.lockoutMs, maxAttempts = LOGIN_SECURITY.maxAttempts) => {
  // identifier: email, IP, or any unique key for lockout scoping
  // attempts: number of failed attempts for this identifier
  // lockoutMs: lockout duration in milliseconds (default 15 minutes)
  // maxAttempts: maximum failed attempts before lockout (default 5)

  if (attempts < maxAttempts) return 0;
  return lockoutMs;
};

export const isLockedOut = (attempts, maxAttempts = LOGIN_SECURITY.maxAttempts) => attempts >= maxAttempts;

export const getRemainingLockoutMs = (lockedAt, lockoutMs = LOGIN_SECURITY.lockoutMs) => {
  if (!lockedAt) return 0;
  const elapsed = Date.now() - new Date(lockedAt).getTime();
  return Math.max(0, lockoutMs - elapsed);
};

const loginAttemptKey = (email, ip) =>
  `login:${String(email || "").trim().toLowerCase() || "unknown"}|${String(ip || "").trim() || "unknown"}`.slice(0, 320);

export const getLoginLockoutState = async ({ email, ip } = {}) => {
  try {
    const key = loginAttemptKey(email, ip);
    const record = await LoginAttempt.findOne({ identifier: key }).lean();
    if (!record) return { locked: false, remainingMs: 0, attempts: 0 };
    const remainingMs = getRemainingLockoutMs(record.lockedAt, LOGIN_SECURITY.lockoutMs);
    const locked = Boolean(record.lockedAt) && remainingMs > 0 && (record.attempts || 0) >= LOGIN_SECURITY.maxAttempts;
    if (record.lockedAt && remainingMs <= 0) {
      // Expired lockout window: clear state (best-effort).
      LoginAttempt.deleteOne({ identifier: key }).catch(() => {});
    }
    return { locked, remainingMs, attempts: record.attempts || 0 };
  } catch (error) {
    logger.warn("Login lockout state check failed", { error });
    return { locked: false, remainingMs: 0, attempts: 0 };
  }
};

export const recordFailedLoginAttempt = async ({ email, ip, req } = {}) => {
  try {
    const key = loginAttemptKey(email, ip);
    const now = new Date();
    const existing = await LoginAttempt.findOne({ identifier: key }).lean();
    let attempts = (existing?.attempts || 0) + 1;
    let lockedAt = existing?.lockedAt || null;

    // Reset stale window.
    if (existing?.lastAttemptAt && now.getTime() - new Date(existing.lastAttemptAt).getTime() > LOGIN_SECURITY.lockoutMs && !existing.lockedAt) {
      attempts = 1;
      lockedAt = null;
    }

    if (!lockedAt && attempts >= LOGIN_SECURITY.maxAttempts) {
      lockedAt = now;
    }

    await LoginAttempt.findOneAndUpdate(
      { identifier: key },
      { $set: { attempts, lockedAt, lastAttemptAt: now } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const locked = Boolean(lockedAt);
    if (LOGIN_SECURITY.auditLoginEvents) {
      recordAudit({
        req,
        action: locked ? "auth.login.locked" : "auth.login.failed",
        resource: "auth",
        statusCode: locked ? 429 : 401,
        details: { attempts, locked, hasEmail: Boolean(email) },
      }).catch(() => {});
    }
    return { locked, attempts };
  } catch (error) {
    logger.warn("Failed login attempt record failed", { error });
    return { locked: false, attempts: 0 };
  }
};

export const clearLoginAttempts = async ({ email, ip } = {}) => {
  try {
    await LoginAttempt.deleteOne({ identifier: loginAttemptKey(email, ip) });
  } catch (error) {
    logger.warn("Clear login attempts failed", { error });
  }
};

const summarizeUserAgent = (userAgent = "") => {
  const ua = String(userAgent || "").slice(0, 300);
  if (!ua) return "Unknown device";
  // Minimal, non-identifying summary (avoid storing/parsing unnecessary fingerprint data).
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /Chrome\//.test(ua) && !/Edg\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) && !/Chrome\//.test(ua) ? "Safari" : "Browser";
  const os =
    /Windows/i.test(ua) ? "Windows" :
    /Android/i.test(ua) ? "Android" :
    /iPhone|iPad|iPod/i.test(ua) ? "iOS" :
    /Mac OS X/i.test(ua) ? "macOS" :
    /Linux/i.test(ua) ? "Linux" : "Unknown OS";
  return `${browser} on ${os}`;
};

const loginAlertsEnabled = async () => {
  try {
    const setting = await Setting.findOne({ key: "security.login_alerts_enabled", isActive: true })
      .select("value valueType")
      .lean();
    if (!setting) return String(process.env.LOGIN_ALERTS_ENABLED ?? "true").toLowerCase() !== "false";
    if (setting.valueType === "boolean") return setting.value !== false;
    return String(setting.value).toLowerCase() !== "false";
  } catch {
    return String(process.env.LOGIN_ALERTS_ENABLED ?? "true").toLowerCase() !== "false"; // fail open for security notifications
  }
};

/**
 * Notify on a real login (session creation). Call ONLY from login flows
 * (email/password, OAuth). Never call from token refresh.
 *
 * Sends at most when the session context is new/suspicious compared to prior
 * active sessions (new IP and/or new device summary). The first-ever active
 * session for a user is treated as notable. Duplicate alerts for the same
 * request are prevented by calling once per successful login.
 */
export const notifyLoginIfNeeded = async ({ user, session, ipAddress, userAgent, requestId }) => {
  try {
    if (!user?.email || !session?._id) return;
    if (!(await loginAlertsEnabled())) return;

    const ip = String(ipAddress || "").slice(0, 100);
    const device = summarizeUserAgent(userAgent);
    const time = new Date().toISOString();

    const prior = await Session.find({
      user: user._id,
      _id: { $ne: session._id },
      revokedAt: null,
    })
      .select("ipAddress userAgent lastUsedAt")
      .lean();

    const isFirstKnownSession = prior.length === 0;
    const knownIp = ip ? prior.some((s) => s.ipAddress && s.ipAddress === ip) : false;
    const knownDevice = prior.some((s) => summarizeUserAgent(s.userAgent) === device);
    const suspicious = !isFirstKnownSession && (!knownIp || !knownDevice);
    const shouldNotify = isFirstKnownSession || suspicious;

    if (!shouldNotify) return;

    const meta = { device, ip: ip || "Unknown", location: "Unknown", time };
    if (suspicious) {
      await EmailService.sendSuspiciousLoginAlert({ email: user.email, name: user.name }, meta);
    } else {
      await EmailService.sendNewLoginAlert({ email: user.email, name: user.name }, meta);
    }
  } catch (error) {
    logger.warn("Login alert email failed", { error, requestId, userId: String(user?._id || "") });
  }
};
