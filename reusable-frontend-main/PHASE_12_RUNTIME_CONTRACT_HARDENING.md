# Phase 12 — Runtime & Contract Hardening

## Fixed
- Event date conversion now rejects invalid dates and requires end time after start time.
- Events/orders/announcements pages now use feature query/mutation hooks rather than owning TanStack Query state directly.
- Admin action controls are hidden unless the current user has the corresponding management permission. Backend authorization remains authoritative.
- Profile validation now matches the backend profile payload (`name`, `phone`, `bio`, `profession`, `address`).
- Registration password bounds now match backend minimum/maximum length.
- CSRF forced refresh no longer discards the forced-refresh intent while a token request is already in flight.
- Payment checkout mutations consistently invalidate current-user payment caches.
- Refunds invalidate payment and order caches.
- Theme/admin sidebar storage uses the namespaced shared storage abstraction.
- API request helper remains compatible with the shared Axios instance.

## Validation
- Architecture audit: 528 TypeScript files scanned.
- Security audit: 528 TypeScript files scanned.
- Backend alignment audit: 528 TypeScript files scanned.
- Full typecheck/build require installed npm dependencies; the execution environment did not have the dependency tree available and npm install timed out.

## Backend companion hotfix
The backend error logger should log `req.path` rather than `req.originalUrl` so password-reset route tokens are not retained in request-error logs.
