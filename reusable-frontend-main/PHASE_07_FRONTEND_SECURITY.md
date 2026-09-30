# PHASE 07 — Frontend API Consolidation, CSRF & Auth Synchronization

## API consolidation

- One feature-facing API facade: `src/shared/api/client.ts`.
- Axios configuration/interceptors remain centralized in `src/shared/api/axios.ts`.
- Legacy request helpers now delegate to the same facade instead of creating another request layer.
- Response normalization and error conversion happen in one place.

## CSRF

- Mutating browser requests obtain the double-submit token automatically.
- A stale CSRF token is cleared and refreshed once after a `403 CSRF_INVALID` response.
- Auth cookies remain HttpOnly; the CSRF token is intentionally readable by browser JavaScript.

## Auth synchronization

- Backend HttpOnly cookies remain the source of truth.
- React Query owns the current-user server state.
- Redux mirrors only lightweight authorization UI state.
- Login/logout/session-expiry events synchronize within the current tab and across tabs using `BroadcastChannel` when available.
- Session expiry clears current-user/session/permission caches and Redux auth state.
