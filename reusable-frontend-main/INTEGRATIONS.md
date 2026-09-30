# Backend Integration Contract

This frontend is intentionally a browser-safe facade over backend integrations.

## Payments

Supported backend providers:

- Stripe
- EasyPaisa
- JazzCash

Use:

```text
UI → payment hook → payment service → payment API → backend payment service → provider
```

The browser sends only safe checkout/order data. Provider credentials, signature generation, refund credentials and webhook verification remain on the backend.

## Files

Use the `src/modules/media` feature for browser uploads. The reusable backend can store media in Cloudinary or another configured provider without exposing provider secrets to the browser.

## Email

Email delivery is a backend responsibility. The frontend should request an application API operation when an email workflow is required; SMTP credentials and templates remain server-side.

## Webhooks

Stripe, EasyPaisa and JazzCash callbacks/webhooks are backend endpoints. The frontend must not attempt to verify provider signatures.
