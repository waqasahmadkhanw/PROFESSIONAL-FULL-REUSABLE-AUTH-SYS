# Frontend ↔ Latest Reusable Backend Alignment

Reference backend: `reusable-backend-main-chai-standard.zip`

This frontend was rebuilt from the supplied `reusable-frontend-main.zip`. No previously generated frontend archive was used as the implementation source.

## Covered backend API groups

- `/api/user`
- `/api/profile`
- `/api/users`
- `/api/roles`
- `/api/settings`
- `/api/media`
- `/api/notifications`
- `/api/announcements`
- `/api/events`
- `/api/audit-logs`
- `/api/orders`
- `/api/coupons`
- `/api/payments`
- `/api/security/csrf`

## Important contract fixes

### Settings
The current backend validator is strict and does not declare `value` for create/update settings. The frontend now:
1. Creates/updates setting metadata through the CRUD endpoint.
2. Sends the actual value through `PATCH /api/settings/bulk`, which is explicitly supported by the backend validator/controller.

This prevents the existing settings form from receiving a 422 for an otherwise valid setting value.

### Audit logs
`DELETE /api/audit-logs/clear` requires:
```json
{
  "confirm": "DELETE_ALL"
}
```
The frontend now sends this body.

### Payments
Checkout request payloads now match the backend:
- Stripe: `{ orderId }`
- EasyPaisa: `{ orderId, mobileNumber? }`
- JazzCash: `{ orderId, mobileNumber? }`

The frontend also models the provider-specific checkout responses, including JazzCash `gatewayUrl`, `formFields`, `secureHash`, and `transactionId`.

### Users
The user-management update model now supports the backend's `role` field in addition to activation and profile fields.

### Media
Media upload metadata now supports `isPublic`, matching the backend controller.

## Added authenticated user routes

- `/orders` — uses `/api/orders/me`
- `/payments` — uses `/api/payments/me`
- `/notifications` — uses `/api/notifications`
- `/announcements` — uses authenticated published announcements
- `/events` — uses authenticated event visibility rules

Admin routes remain under `/admin/*`.

## Verification

Architecture audit: PASSED

Security audit: PASSED

Backend alignment audit: PASSED

TypeScript compiler could not complete because this source archive does not contain the installed project dependency/type-definition tree. The repository-level audits above completed successfully.
