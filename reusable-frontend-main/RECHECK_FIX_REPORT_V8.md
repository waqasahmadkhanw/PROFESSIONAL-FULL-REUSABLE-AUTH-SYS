# Frontend V8 Full Recheck & Fix Report

## Scope
Re-read the complete frontend source tree file-by-file, compared API contracts against the paired reusable backend V3, and ran static architecture/smoke checks.

## Fixed
- Fixed React Rules-of-Hooks violation in admin layout: authorization redirect effect now runs before conditional returns.
- Fixed authentication identity mismatch: backend Mongo documents expose `_id`; frontend now normalizes `_id` to `id` for login, registration, and current-user responses.
- Preserved/normalized backend `socials` into frontend `socialLinks`.
- Fixed profile API response typing for avatar deletion.
- Fixed avatar upload response typing to match backend's full-user response.
- Added reusable profession/address fields to profile editing because the backend supports them.
- Added permission-aware admin navigation so users only see links matching their explicit permissions; system admin role can see all admin navigation.
- Fixed media list count fallback because backend returns `media + pagination` without a `count` field.
- Cleared all auth query branches on logout instead of only current-user cache.
- Fixed payment checkout invalidation to cover parameterized `/payments/me` cache entries.
- Memoized ThemeProvider's setter to avoid recreating context values unnecessarily.

## Verification
- Architecture audit: PASS (518 TypeScript files scanned)
- Smoke test: PASS
- Relative import audit: PASS
- Backend JS syntax audit: PASS
- package-lock versions match package.json for Next/React
- Full TypeScript/build could not be completed because dependencies are not installed and registry access timed out; `npm ci --offline` also correctly failed because packages were not cached.

## Important paired-backend compatibility fix
The frontend depends on effective role permissions for dynamic admin navigation. The paired backend V4 now includes resolved role + user permissions in login/current-user responses. This avoids a false 403 for custom roles whose permissions come from the Role document.
