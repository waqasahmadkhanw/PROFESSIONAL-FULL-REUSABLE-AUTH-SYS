/**
 * Generates a request-scoped idempotency key for payment mutations.
 * The key is created by the mutation invocation, so React Query retries (when
 * enabled) reuse the same request options instead of issuing a new payment key.
 */
export function createIdempotencyKey(prefix = "request"): string {
  const uuid = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  return `${prefix}_${uuid}`;
}
