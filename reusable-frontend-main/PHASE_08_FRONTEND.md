# PHASE 08 — Payment Page Extraction, Server-Side Filters & CSV Utility

- Extracted payment page state, filters, selection and query orchestration into `usePaymentManagement`.
- Removed client-side filtering of the current page.
- Search, status and payment-method filters are now sent to the backend.
- Added debounced search to avoid a request on every keystroke.
- Added reusable `src/shared/utils/csv.ts` with correct CSV quote escaping, UTF-8 BOM and Blob downloads.
