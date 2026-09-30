# Reusable MERN Frontend Template

A production-oriented Next.js frontend starter designed to pair with the reusable Express/MongoDB backend template.

## Principles

- Refactor and reuse before replacing.
- Components never call Axios directly.
- Server state belongs to TanStack Query.
- Authentication/session state may use the existing Redux slice.
- Provider secrets remain on the backend.
- Core modules stay independent from business-specific modules.
- Add domain features under `src/modules/<feature>` without changing shared infrastructure.

## Stack

- Next.js App Router
- React + TypeScript strict mode
- Tailwind CSS
- TanStack Query
- Redux Toolkit (authentication/session only)
- Axios
- React Hook Form + Zod
- Radix UI primitives

## Architecture

```text
src/
├── app/                         # routes and screen composition
├── core/                        # universal infrastructure contracts
├── integrations/                # backend-facing external payment facades
├── modules/
│   ├── auth/                    # authentication, sessions, password flows
│   ├── users/                   # generic user administration
│   ├── roles/                   # dynamic roles and permissions
│   ├── notifications/           # generic in-app notifications
│   ├── media/                   # generic file/media management
│   ├── payments/                # Stripe, EasyPaisa and JazzCash UI
│   ├── dashboard/               # domain-neutral dashboard shell
│   ├── settings/                # application settings
│   ├── audit-logs/              # audit history
    │   ├── announcements/           # generic content publishing
    │   ├── events/                  # generic calendar/event management
    │   ├── coupons/                 # generic promotions/discounts
    │   ├── orders/                  # generic order lifecycle
│   └── _template/               # copy this for a new domain feature
└── shared/
    ├── api/                     # Axios instance, client, response helpers
    ├── components/              # reusable UI
    ├── config/                  # public environment configuration
    ├── constants/               # query keys and shared constants
    ├── hooks/                   # cross-feature hooks
    ├── lib/                     # small framework-agnostic helpers
    ├── providers/               # app-wide providers
    └── store/                   # minimal global client state
```

## Exact request flow

```text
Page
  ↓
Component
  ↓
Feature Hook
  ↓
TanStack Query / Mutation
  ↓
Feature Service
  ↓
Feature API Adapter
  ↓
Shared API Client
  ↓
Axios
  ↓
Backend Route
  ↓
Backend Controller → Service → Model
```

### Rules

**Do not do this**

```ts
// Component.tsx
const response = await axios.get("/users");
```

**Do this**

```text
Component → useUsersQuery → userService.list → userApi.list → apiClient
```

## Core integrations

The frontend knows only how to request backend operations:

- Stripe
- EasyPaisa
- JazzCash
- Cloudinary-backed uploads through the media module

The browser never receives:

- Stripe secret keys
- EasyPaisa credentials
- JazzCash integrity salt/passwords
- SMTP credentials
- Cloudinary API secret
- JWT signing secrets

Payment webhooks/callbacks are backend concerns.

## Adding a new feature

Copy `_template`:

```text
src/modules/products/
├── api/
├── components/
├── hooks/
├── mutations/
├── queries/
├── services/
├── types/
├── validation/
└── index.ts
```

Implement in this order:

1. Backend contract
2. Types
3. Validation
4. Query keys
5. API adapter
6. Service
7. Query/mutation hooks
8. Reusable components
9. Page
10. App route
11. Tests
12. Final architecture audit

## Environment

Copy `.env.example` to `.env.local`.

Only public browser configuration belongs in `NEXT_PUBLIC_*`.

## Verification

```bash
npm install
npm run typecheck
npm run lint
npm run architecture-audit
npm run smoke-test
npm run build
```

Business-specific modules removed from this template can be restored later as independent feature modules without changing the core API/client, UI system, authentication, or provider abstractions.
