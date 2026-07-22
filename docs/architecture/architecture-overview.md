# Architecture Overview

## System Shape

```
┌─────────────────────┐        REST / JSON        ┌──────────────────────┐
│   Next.js Frontend    │ ─────────────────────────▶ │    Laravel API         │
│   (App Router, RSC)   │ ◀───────────────────────── │    /api/v1/*           │
└─────────────────────┘         JWT Bearer          └──────────────────────┘
         │                                                     │
         │ next/font, static assets                            │ Eloquent ORM
         ▼                                                     ▼
   Vercel / Node host                                   MySQL 8  +  Cloudinary
```

The frontend and backend are **independently deployable**. The only
contract between them is the REST API surface documented in
`docs/api/` and mirrored in `shared/`. This means:

- The API can be consumed by the admin dashboard, a future mobile
  app, or third-party integrations without change.
- The frontend can be redeployed, rolled back, or CDN-cached
  independently of API releases.
- Either half can be scaled horizontally on its own (stateless JWT
  auth means no sticky sessions are required on the API tier).

## Why these architectural choices

**JWT over session auth.** The API has no browser session state —
every request carries a bearer token, validated statelessly. This
lets the API scale to multiple nodes behind a load balancer with zero
session-affinity configuration, and lets the same auth mechanism serve
a future mobile client without adapting to cookie-based auth.

**API versioning from day one (`/api/v1`).** Introduced in Phase 1
specifically so that Phase 6+ (checkout, payments) can introduce
breaking response-shape changes as `/api/v2` without a coordinated
frontend/backend release.

**Cloudinary over local/S3 disk storage.** Product photography is the
single highest-traffic asset class on a fashion site. Cloudinary
provides on-the-fly responsive transforms (`f_auto,q_auto`) and a CDN,
removing the need to pre-generate and store multiple image sizes per
product — which both simplifies the upload pipeline and keeps the API
tier stateless (no shared filesystem needed across nodes).

**Services layer between Controllers and Models.** Controllers
(`app/Http/Controllers`) stay thin HTTP adapters; business logic lives
in `app/Services`. This is what lets, e.g., the same registration flow
be triggered from an Artisan command (bulk admin invite) or a queued
job later without duplicating logic or instantiating an HTTP request.

**Monorepo, not a shared package.** Frontend (TypeScript) and backend
(PHP) can't literally share compiled code, so rather than a
theoretical "shared package," `shared/` holds documented contracts
(JSON Schema, enum lists) that both sides are kept in sync against —
a deliberately low-tech solution that avoids a third build pipeline.

## Environments

| Environment | Frontend                     | Backend                          | Database         |
|-------------|-------------------------------|-------------------------------------|--------------------|
| Local        | `npm run dev` (Turbopack)     | `php artisan serve`                | Local MySQL / SQLite (tests) |
| Staging      | Vercel preview / Node host    | Container behind a load balancer   | Managed MySQL      |
| Production   | Vercel / Node host + CDN      | Container, horizontally scaled      | Managed MySQL (primary + read replica, introduced when traffic warrants it) |

## What's deliberately not decided yet

Deployment target (Vercel vs. self-hosted Node for the frontend;
container platform for the backend), CI/CD pipeline, and Redis
introduction are intentionally left open — Phase 1 is architecture and
foundation, not infrastructure provisioning. `config/queue.php` and
`config/cache.php` already support switching from the `database`
driver to `redis` via environment variables alone, so that migration
requires no code changes when it becomes necessary.
