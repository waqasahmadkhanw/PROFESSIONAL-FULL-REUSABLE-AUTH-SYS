/**
 * Security service for account lockout and login attempt tracking.
 * Provides per-identifier lockout calculations to prevent brute-force attacks.
 */

export const getLockoutRemainingMs = (identifier, attempts, lockoutMs = 900000, maxAttempts = 5) => {
  // identifier: email, IP, or any unique key for lockout scoping
  // attempts: number of failed attempts for this identifier
  // lockoutMs: lockout duration in milliseconds (default 15 minutes)
  // maxAttempts: maximum failed attempts before lockout (default 5)

  if (attempts < maxAttempts) return 0;
  return lockoutMs;
};

export const isLockedOut = (attempts, maxAttempts = 5) => attempts >= maxAttempts;

export const getRemainingLockoutMs = (lockedAt, lockoutMs = 900000) => {
  if (!lockedAt) return 0;
  const elapsed = Date.now() - new Date(lockedAt).getTime();
  return Math.max(0, lockoutMs - elapsed);
};
