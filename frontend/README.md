# Frontend — Next.js Storefront

See the [root README](../README.md) for full setup instructions. This
file documents frontend-specific structure and conventions.

## Folder Guide

```
src/
├── app/                 Next.js App Router routes — (site)/ is the public
│                        storefront, admin/ is the admin dashboard (Phase 6)
├── components/
│   ├── ui/                Shadcn UI primitives — generated via CLI, not hand-written
│   ├── shared/             Small reusable presentational components
│   ├── layout/             Header/footer/nav shell (empty — Phase 1 excludes it)
│   └── providers/          Client-side provider composition (React Query, ...)
├── hooks/                Reusable React hooks
├── services/api/          Typed wrappers around REST endpoints (axios)
├── store/                 Zustand global client state
├── lib/                   Framework-agnostic utilities (cn, formatting, validation)
├── config/                env.ts, site.ts, fonts.ts — app configuration
├── constants/             Route paths, API endpoint paths
├── types/                 Shared TypeScript types/interfaces
└── styles/globals.css     Design tokens (see docs/architecture/design-system.md)
```

## Conventions

- Import via path aliases (`@/components/...`, `@/lib/...`) — never
  relative-path across top-level folders (see `tsconfig.json` → `paths`).
- Never hard-code a color; use the semantic or brand Tailwind tokens
  documented in `docs/architecture/design-system.md`.
- All HTTP calls go through `src/services/api/*.service.ts`, which use
  the shared `apiClient` — no component calls `axios` or `fetch`
  directly against the API.
- Add Shadcn components with the CLI (`npx shadcn@latest add <name>`),
  not by hand, so they stay aligned with `components.json`.

## Scripts

See the table in the [root README](../README.md#5-available-scripts).
