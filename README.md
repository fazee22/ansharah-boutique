# Verrière — Luxury Fashion E-Commerce Platform

An enterprise-grade, premium fashion e-commerce platform: a complete customer
storefront, a full admin dashboard, real payment architecture, and a
production-hardened Laravel API. This repository is a **monorepo** containing
an independently deployable Next.js frontend and a Laravel REST API, sharing
a common design and type vocabulary.

> **Status:** Phase 11 of 12 — Final Optimization. The application is
> feature-complete and production-hardened: real customer accounts, a real
> checkout flow, a modular multi-gateway payment architecture, a fully
> admin-editable storefront (homepage, sliders, settings), and an enterprise
> admin dashboard. See [`PROJECT_MEMORY.md`](./PROJECT_MEMORY.md) for the
> full phase-by-phase history and every architectural decision, and
> [`CHANGELOG.md`](./CHANGELOG.md) for a detailed, file-level log of every
> phase.

---

## What's Inside

**Customer storefront** — homepage, collections (mega-menu navigation
matching an exact category tree), product pages with a full gallery/zoom/
lightbox, live search with recent searches and keyword highlighting,
filters and sorting, a wishlist, a cart, a real checkout, customer accounts
with order tracking, and every supporting page a real store needs (About,
Contact, FAQ, five legal/policy pages).

**Admin dashboard** — a Shopify-quality panel covering products (with
drag-and-drop multi-image upload), categories/collections, orders (with a
timeline and printable invoices), customers, a homepage manager, a hero
banner and auto-moving slider manager, new arrivals/sale curation, a
newsletter list, and WhatsApp/website/SEO settings — all backed by a real
database, not a mockup.

**Payments** — a modular gateway architecture (Stripe, JazzCash, EasyPaisa,
Cash on Delivery) behind one shared interface, real order placement, and a
full payment-status page set (success/failed/pending/confirmation), with a
downloadable invoice.

Frontend and backend are deliberately decoupled — they communicate only
over the REST API contract in `backend/routes/api.php`, so either can be
deployed, scaled, or replaced independently.

## Documentation Map

This project is documented across several focused files rather than one
giant README — start with whichever matches what you're trying to do:

| Document | What it's for |
|---|---|
| **[INSTALLATION.md](./INSTALLATION.md)** | Setting the project up on your machine, step by step, including VS Code specifics |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Taking this to a real production server/host |
| **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** | Using the admin dashboard day to day, as a store owner |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | The full REST API contract — every endpoint, request, and response |
| **[DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)** | Every table, column, and relationship in the schema |
| **[PROJECT_MEMORY.md](./PROJECT_MEMORY.md)** | Architecture decisions, trade-offs, and the reasoning behind them, phase by phase |
| **[CHANGELOG.md](./CHANGELOG.md)** | What changed, file by file, phase by phase |
| **[docs/architecture/](./docs/architecture)** | Deep dives on specific subsystems (design system, navigation, marquee, admin dashboard) |

## Repository Layout

```
luxury-ecommerce/
├── frontend/          Next.js 15 + React 19 + TypeScript — storefront & admin UI
├── backend/           Laravel 12 REST API (JWT authentication, MySQL, Cloudinary)
├── shared/            Framework-agnostic types & constants shared by both apps
├── database/          ERDs, schema notes, and standalone SQL references
├── docs/              Architecture decisions and API documentation
├── README.md          You are here
├── INSTALLATION.md    Local setup, step by step
├── DEPLOYMENT_GUIDE.md    Production deployment
├── ADMIN_GUIDE.md         How to run the store day to day
├── API_DOCUMENTATION.md   Full REST API reference
├── DATABASE_STRUCTURE.md  Full schema reference
├── PROJECT_MEMORY.md  Living project memory, updated after every phase
└── CHANGELOG.md       Chronological, file-level record of completed work
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Radix UI primitives |
| Motion | Framer Motion |
| State | Zustand, TanStack Query |
| Backend | Laravel 12, PHP 8.3+ |
| API | REST, versioned (`/api/v1`) |
| Auth | JWT (`php-open-source-saver/jwt-auth`) |
| Database | MySQL 8 |
| Media Storage | Cloudinary |
| Payments | Stripe, JazzCash, EasyPaisa, Cash on Delivery |
| Email | Laravel Mail (queued, HTML templates) |
| Linting/Format | ESLint, Prettier, Laravel Pint |
| Testing | Pest (backend) |

## Quick Start

Full detail (prerequisites, environment variables, Cloudinary setup,
troubleshooting) is in **[INSTALLATION.md](./INSTALLATION.md)** — this is
the abbreviated version for anyone who just wants the app running:

```bash
git clone <your-repo-url> luxury-ecommerce
cd luxury-ecommerce

# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve          # http://127.0.0.1:8000

# Frontend (in a second terminal)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev                 # http://127.0.0.1:3000
```

Then:
- Storefront: **http://127.0.0.1:3000**
- Admin dashboard: **http://127.0.0.1:3000/admin/login** — `admin@luxury.test` / `password` (seeded)
- API health check: **http://127.0.0.1:8000/api/v1/health** should return `{"status":"ok"}`

## Available Scripts

**Frontend** (`frontend/package.json`)

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run typecheck` | Run the TypeScript compiler (no emit) |

**Backend** (`backend/composer.json`)

| Script | Purpose |
|---|---|
| `composer run dev` | Serve + queue listener concurrently |
| `composer run test` | Run the Pest test suite |
| `./vendor/bin/pint` | Run Laravel Pint (code style) |

## Design Note

This project's shopping experience, navigation quality, and premium feel
are **inspired by** Ramsha.pk. No branding, imagery, copy, layout, or code
from that site is copied. All visual identity (palette, typography,
components) in this repository is original.

## Known, Documented Scope Boundaries

A few things are deliberately deferred, each explained in full in
`PROJECT_MEMORY.md`:

- The storefront's product catalog runs on realistic mock data
  (`frontend/src/lib/mock/products.ts`); the admin dashboard manages a
  genuinely separate, real backend catalog. Checkout works today regardless
  (order line items are snapshotted, not linked to a live product row).
- The Wishlist is intentionally client-only (localStorage) for both guests
  and logged-in customers, even though a real, tested backend wishlist API
  exists — see `PROJECT_MEMORY.md`'s Phase 8 notes for why.
- Welcome and Password Reset emails have real templates but no automatic
  trigger yet (no registration/forgot-password flow calls them).

## License

Proprietary — all rights reserved. Not licensed for reuse.
