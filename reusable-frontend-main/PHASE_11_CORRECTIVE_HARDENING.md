# Phase 11 — Corrective Hardening

## Scope

This phase fixes confirmed frontend defects found during the backend-alignment audit while preserving the existing Next.js App Router architecture and backend contracts.

## Corrections

- Coupon management page now uses the existing feature query/mutation hooks instead of calling TanStack Query and the API adapter directly.
- Coupon creation validates code, discount type/value, and future expiry before sending a request.
- Coupon creation supports both percentage and fixed discount types instead of hard-coding percentage.
- Invalid date conversion is prevented before `toISOString()` is called.
- Media uploads, profile avatar uploads, and auth avatar uploads now consistently run the shared client-side magic-byte/size/MIME validation before multipart submission.
- Browser storage parsing is now resilient to corrupted values.
- `storage.clear()` is namespaced and no longer clears unrelated application/site localStorage keys.
- Frontend environment parsing now rejects invalid booleans, non-positive numeric settings, malformed URLs, and missing required production URLs.
- Production API/Site URLs must use HTTPS.
- Axios auth-route detection now compares normalized URL paths instead of using substring matching, preventing false-positive authentication endpoint matches.
- Removed an unused AxiosError import.

## Important correction

`DELETE /api/profile/account` is a valid backend route and the frontend endpoint `/profile/account` uses the correct DELETE method. It was previously misidentified as a route bug; this phase does **not** change it.

## Validation

The existing architecture, security, and backend-alignment audit scripts should be run after dependency installation. This archive intentionally does not include `node_modules`, `.next`, or build cache artifacts.
