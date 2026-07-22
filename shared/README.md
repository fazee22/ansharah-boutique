# `shared/`

Framework-agnostic contracts that both `frontend` (TypeScript) and
`backend` (PHP) must agree on. Since the two apps don't share a
runtime, "shared" here means a single documented source of truth that
each side's typed constants are manually kept in sync with — not
shared executable code.

- `constants/enums.json` — canonical enum values (roles, currencies,
  order/product statuses as they're introduced). When one side adds a
  value, update this file and the mirrored constant in the other app
  in the same pull request.
- `types/` — plain-language / JSON Schema description of cross-cutting
  DTOs (e.g. the auth session shape), for reference when writing the
  TypeScript types in `frontend/src/types` and the PHP Resources in
  `backend/app/Http/Resources`.
