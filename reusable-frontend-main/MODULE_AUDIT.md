# Reusable Frontend Module Audit

## Core modules now included

- `auth`: register, login, logout, refresh session, current user, forgot password, reset password, change password, profile update, avatar upload/delete, account deletion, auth guards, guest guards, session-expired/unauthorized screens.
- `users`: generic user administration, CRUD, activation, dynamic role assignment.
- `roles`: dynamic roles, permissions, user-permission assignment.
- `notifications`: user notifications, unread count, read/unread, delete, admin send.
- `media`: generic file/media upload, list, detail, update, delete.
- `payments`: payment history, detail, refund, checkout integrations for Stripe, EasyPaisa and JazzCash.
- `orders`: generic order history, admin order list, order detail, cancellation.
- `coupons`: generic percentage/fixed promotion management.
- `announcements`: generic publishing/content announcements with pin/publish/archive support.
- `events`: generic calendar/event management and status lifecycle.
- `settings`: application configuration and public settings.
- `audit-logs`: activity history, statistics, detail, clear/delete.
- `dashboard`: domain-neutral admin dashboard shell.
- `_template`: feature scaffold for any future domain module.

## Authentication coverage

The frontend already contains the essential password/session flows:

1. Register
2. Login
3. Logout
4. Refresh token/session restoration
5. Current-user/session query
6. Forgot password
7. Reset password
8. Change password
9. Update profile
10. Upload/delete avatar
11. Delete account
12. Auth/guest guards
13. Session expired page
14. Unauthorized/403 page

## Missing but intentionally NOT faked

### Email verification / resend verification
The current reusable backend contains an email verification template/service, but **does not expose a verification API route or persist verification OTP/token fields on the User model**. A frontend screen without a backend contract would be fake functionality, so it was not added as a live module.

### OTP authentication
No backend OTP endpoints exist. The reusable frontend keeps the generic OTP input component available, but does not expose a non-functional OTP flow.

### Two-factor authentication
The previous frontend contained orphaned 2FA mutation files even though the backend has no 2FA endpoints/model support. Those broken files were removed rather than pretending 2FA works.

### Google/social login
The backend has a Google token verification service but currently has no `/user/google-login` controller/route. A live frontend social-login flow therefore requires the backend endpoint first.

## Optional domain modules intentionally not part of the universal core

Cart, wishlist, product catalog, inventory, subscriptions, CRM pipelines, tickets, chat, reviews, attendance, courses, lessons, etc. are useful but are **domain modules**, not universal infrastructure. They should be added from `_template` or as separate feature packages when the application needs them.
