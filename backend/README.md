# Backend — Laravel API

REST API for the platform. See the [root README](../README.md) for full
setup instructions; this file documents backend-specific structure.

## Folder Guide

```
app/
├── Http/
│   ├── Controllers/Api/V1/   Thin HTTP adapters — validate via Requests,
│   │                         delegate to Services, respond via ApiResponse
│   ├── Middleware/           Route-level cross-cutting concerns
│   ├── Requests/             Form validation (one class per action)
│   └── Resources/            API response transformers
├── Models/                   Eloquent models
├── Services/                 Business logic, framework-agnostic where possible
├── Repositories/             Reserved for data-access abstraction as the
│                             catalog/order domain grows (empty in Phase 1)
├── Providers/                Service container bindings & boot logic
└── Support/                  Small framework-adjacent helpers (ApiResponse)

routes/
├── api.php      Versioned REST routes (/api/v1/...)
├── web.php      Single JSON root route — no server-rendered views
└── console.php  Artisan command definitions

database/
├── migrations/  Schema, in dependency order
├── factories/   Model factories for tests & seeding
└── seeders/     DatabaseSeeder + feature-specific seeders
```

## Conventions

- **Every** API response is shaped by `App\Support\ApiResponse`
  (`success`, `message`, `data`, optional `errors`/`meta`) — never
  return a raw array or model from a controller.
- Controllers stay thin: validation lives in `Http\Requests`, business
  logic in `Services`, output shaping in `Http\Resources`.
- Routes are versioned under `/api/v1` from day one so a future
  breaking change ships as `/api/v2` without touching v1 clients.
- Auth guard is `api` (JWT, stateless) — see `config/auth.php` and
  `config/jwt.php`. There is no session-based web auth guard.

## Admin Module (Phase 6)

`app/Http/Controllers/Api/V1/Admin`, `Http/Requests/Admin`,
`Http/Resources/Admin` hold everything behind
`/api/v1/admin/*` — protected by `jwt.auth` + `role:admin,super_admin`.
See [`docs/api/admin.md`](../docs/api/admin.md) for the full endpoint
reference. `Category` is one self-referencing tree table backing both
"Collections" and "Categories" in the admin UI — see the migration's
doc comment for why.

Local admin login: **admin@luxury.test** / **password** (seeded by
`DatabaseSeeder` → `UserFactory`'s default password).

## Testing

Pest is configured (`tests/Pest.php`) with an in-memory SQLite
connection for speed — no MySQL needed to run the suite.

```bash
composer test
# or
./vendor/bin/pest
```
