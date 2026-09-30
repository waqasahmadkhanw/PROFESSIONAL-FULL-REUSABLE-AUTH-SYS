# Feature Module Template

Copy this directory when adding a domain such as products, courses, projects, tickets, or users.

Rules:
- `api/`: HTTP calls only.
- `services/`: domain orchestration and mapping.
- `queries/` / `mutations/`: React Query server-state hooks.
- `hooks/`: feature-specific UI/application hooks.
- `validators/`: Zod schemas for request/form validation.
- `components/`: feature UI only.
- `types/`: TypeScript contracts.

Dependency direction:
`components -> hooks -> queries/mutations -> services -> api -> shared/api`
