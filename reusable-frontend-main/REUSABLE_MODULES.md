# Reusable Module Inventory

## Core authentication
- Register
- Login
- Logout
- Refresh token/session recovery
- Current user
- Forgot password
- Reset password
- Change password
- Session expired
- Auth guard / guest guard
- Profile update
- Avatar upload/delete
- Account deletion

## Identity & authorization
- Users CRUD
- User activation/deactivation
- User role assignment
- Roles CRUD
- Permission catalog
- Per-user permissions
- Permission-aware navigation

## User/account
- Profile
- Social links
- Account security
- Public settings
- Application settings

## Communication
- Notifications
- Unread notification count
- Mark read / mark all read
- Delete notification
- Admin notification sending
- Announcements
- Publish/archive/pin announcements

## Content/system
- Media upload/list/detail/update/delete
- Events CRUD/status
- Audit logs list/detail/stats/delete/clear

## Commerce/payment
- Generic orders
- Order details/cancel
- Coupons CRUD
- Stripe checkout
- EasyPaisa checkout
- JazzCash checkout
- Payment history/details
- Refunds

## Shared infrastructure
- Axios API client
- Auth/session refresh handling
- TanStack Query
- Redux global state
- Centralized endpoints/query keys
- Pagination/filtering/debounce helpers
- Form validation
- Upload utilities
- Error/success normalization
- Responsive UI primitives
- Theme/dark mode
- Loading/error/empty states
- Generic feature template

## Intentionally not added
Domain-specific modules such as products, cart, wishlist, inventory, booking, LMS courses, CRM leads, ERP accounting, hospital records, etc. should be added as optional domain modules because their APIs/data models differ between applications. The reusable core must not contain fake endpoints for modules unsupported by the backend.
