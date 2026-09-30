# Reusable MERN Frontend Template — Release Notes

## Source and strategy

This release was produced by refactoring the existing Next.js frontend. The application was not rebuilt from scratch.

## Removed from the template

Domain-specific LMS behavior was removed from retained infrastructure, including:

- student/instructor-specific user APIs
- course/lesson media usage options
- LMS-only notification types
- LMS-only permission groups
- student/course-specific payment fields and UI assumptions
- the broken domain-specific dashboard API dependency
- unused browser email and storage facades

## Retained core modules

- authentication and session management
- generic users and dynamic roles/permissions
- notifications
- generic media/file management
- payments
- domain-neutral dashboard shell
- settings
- audit logs
- profile
- shared API/UI/state infrastructure
- feature-module template
- Stripe, EasyPaisa and JazzCash payment integrations

## Payment preservation

Payment functionality was intentionally retained and made domain-neutral. Checkout requests now use `orderId` instead of LMS-specific `courseId`, while payment records use generic customer/order/item concepts.

## Backend compatibility fixes

The frontend endpoint registry was aligned with the reusable backend routes, including `/user/*`, `/users/*`, `/profile/*`, and `/payments/*`.

## Verification

- Architecture audit: passed
- Smoke test: passed
- Removed-feature import references: none found
- Old LMS/domain endpoint references: none found
- Direct Axios usage outside the shared API layer: none found

A full TypeScript/build verification requires installing the project's npm dependencies in an environment with npm registry access.
