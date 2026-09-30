# Frontend Architecture Contract

## Boundary rules

1. `app/` owns routing and composition.
2. `components/` owns presentation.
3. `hooks/` owns reusable stateful behavior.
4. `queries/` and `mutations/` own server-state synchronization.
5. `services/` owns feature operations.
6. `api/` owns HTTP details.
7. `types/` owns domain contracts.
8. `validation/` owns user-input validation.
9. `shared/` cannot import feature modules.
10. Feature components/pages cannot import Axios directly.
11. Backend authorization is authoritative; frontend permissions are UX controls.
12. Provider secrets and webhook processing never run in the browser.

## Backend alignment

Core frontend modules map to the current backend routes:

| Frontend | Backend |
| --- | --- |
| auth | `/api/user/*` |
| users | `/api/user-management/*` |
| roles | `/api/roles/*` |
| notifications | `/api/notifications/*` |
| media | `/api/media/*` |
| payments | `/api/payments/*` |
| dashboard | `/api/dashboard/admin` |
| settings | `/api/settings/*` |
| audit logs | `/api/audit-logs/*` |
| profile | `/api/profile/*` |

Payment provider selection remains behind `paymentGateway`; provider callbacks are not browser routes.

## State policy

- TanStack Query: API/server state.
- Redux: authentication/session client state already present in the project.
- Local React state: transient UI state such as dialogs, filters and form interaction.
- Do not mirror query data into Redux without a demonstrated requirement.
