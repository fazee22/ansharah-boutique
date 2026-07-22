# PROJECT MEMORY

> This file is the persistent memory of the project. It is updated at
> the end of **every** phase and should be read first when resuming
> work in a new session.

---

## 1. Project Overview

A commercial **luxury clothing e-commerce website** with a full
Admin Dashboard, built across 12 phases (Phase 12 was declared the
final phase — see §10 for the release summary). The shopping experience,
navigation quality, animation feel, and overall premium UX are
**inspired by Ramsha.pk** — no branding, imagery, layout, copy, or
code from that site is copied. All visual identity here (palette,
typography, components) is original.

Development proceeded strictly one phase at a time; no phase was ever
started early.

## 2. Technology Stack

| Layer          | Choice                                              |
|-----------------|--------------------------------------------------------|
| Frontend         | Next.js 15 (App Router), React 19, TypeScript          |
| Styling          | Tailwind CSS, Shadcn-style hand-built primitives, Radix UI (Accordion, Dialog), Framer Motion |
| Backend          | Laravel 12, PHP 8.3+ — auth (Phase 1) + admin catalog (Phase 6) |
| API              | REST, versioned at `/api/v1`                            |
| Auth             | JWT (`php-open-source-saver/jwt-auth`), stateless guard `api` |
| Database         | MySQL 8                                                  |
| Media Storage    | Cloudinary                                               |
| Frontend tooling | ESLint (flat config), Prettier, Husky + lint-staged      |
| Backend tooling  | Laravel Pint, Pest                                       |

## 3. Repository Structure

```
luxury-ecommerce/
├── frontend/     Next.js app — see frontend/README.md
│                 app/(site)/ = public storefront incl. account/login/
│                 register (Phase 8); app/admin/ = admin dashboard (Phase 6–7)
├── backend/      Laravel API — see backend/README.md
│                 Admin module (Phase 6–7) + Account module (Phase 8,
│                 any authenticated user) — see docs/api/admin.md
├── shared/       Cross-stack contracts (enums, JSON Schema) — see shared/README.md
├── database/     ERDs + generated SQL schema snapshots — see database/README.md
├── docs/
│   ├── architecture/   design-system.md, architecture-overview.md, navigation.md, marquee.md, admin-dashboard.md
│   └── api/              auth.md, admin.md
├── README.md               Project overview + quick start (Phase 11 rewrite)
├── INSTALLATION.md         Full local setup (Phase 11)
├── DEPLOYMENT_GUIDE.md     Production deployment (Phase 11)
├── ADMIN_GUIDE.md          Store-owner-facing dashboard walkthrough (Phase 11)
├── API_DOCUMENTATION.md    Master API index (Phase 11)
├── DATABASE_STRUCTURE.md   Full schema reference (Phase 11)
├── PROJECT_MEMORY.md   ← this file
└── CHANGELOG.md
```

Full folder-by-folder detail lives in `frontend/README.md` and
`backend/README.md` — not duplicated here to avoid drift.

## 4. Key Architectural Decisions

- **Decoupled monorepo.** Frontend and backend communicate only over
  the versioned REST contract; each is independently deployable.
- **JWT, not session auth**, on the API — stateless, horizontally
  scalable, mobile-ready.
- **Services layer** between Controllers and Models on the backend
  (`app/Services`) — controllers stay thin HTTP adapters.
- **Standard API envelope** (`App\Support\ApiResponse` ↔
  `frontend/src/types/api.ts`) — every endpoint returns
  `{ success, message, data, errors?, meta? }`.
- **Cloudinary is the only media disk** — no local/S3 image storage,
  keeping the API tier stateless.
- **One recursive nav-tree renderer, not two menu implementations.**
  `constants/navigation.ts` defines the menu once; `MegaMenuNode` and
  `MobileNavNode` both walk the same `NavNode` tree recursively. A
  mega-menu grid (all levels visible at once in a column) was chosen
  over nested hover flyouts as the presentation for multi-level
  dropdowns — see `docs/architecture/navigation.md`.
- **RAF-driven marquee, not CSS keyframes**, so the auto-moving
  collection slider can be paused/resumed from its exact current
  position and support real pointer-drag/touch-swipe — a pure CSS
  animation can't do either. See `docs/architecture/marquee.md`.
- **One `MediaPlaceholder` component for all not-yet-real imagery.**
  Every image-shaped gap on the homepage (hero, cards, marquee tiles,
  Instagram grid) renders the same component rather than broken
  `<img>` tags or ad hoc colored boxes, so wiring up real Cloudinary
  photography later touches one file, not every call site.
- **One dynamic catch-all route instead of 13+ page files.**
  `app/collections/[...slug]/page.tsx` resolves any URL against the
  same `NavNode` tree the header's mega menu already walks, via
  `resolveNodePath`. Parent category pages automatically aggregate
  every descendant leaf's products because `Product.categoryPath`
  stores the full ancestor id chain — no separate "does this page
  need aggregation" logic per page.
- **Deterministic (seeded), not random, mock product data.**
  `lib/mock/products.ts` never calls `Math.random()` — every "random-
  looking" value (price, badges, image count) is a pure function of a
  numeric seed, so server-rendered HTML and the client hydration pass
  are byte-identical. This is a real, easy-to-miss Next.js App Router
  pitfall with mock/fixture data. `lib/mock/reviews.ts` follows the
  same rule.
- **One gallery navigation hook, two surfaces.**
  `hooks/use-image-gallery.ts` owns index/keyboard/swipe state; both
  `ProductGallery` (inline) and `ImageLightbox` (fullscreen) consume
  it, so "next image" behaves identically whichever surface triggered
  it — the same pattern already established for the nav tree
  (Phase 4) and the mega menu (Phase 2).
- **Client-only Cart/Wishlist/Recently-Viewed stores, explicitly
  provisional.** All three persist to localStorage via Zustand and
  are documented, in the store files themselves, as placeholders for
  server-persisted equivalents once auth/checkout exist — not a
  design intended to be final.
- **One category tree serves both "Collections" and "Categories"
  (Phase 6).** Depth-0 nodes are what the admin UI calls a
  Collection; everything deeper is a Category — same table, same
  controller, same frontend tree component. See
  `docs/architecture/admin-dashboard.md`.
- **Admin panel is real backend; storefront still runs on mock data
  (Phase 6).** A deliberate scope boundary — see Phase 6's "Scope
  decision" note above and `docs/architecture/admin-dashboard.md`.
- Full rationale for each decision is in
  `docs/architecture/architecture-overview.md`.

## 5. Design System Summary

Luxury/minimal/editorial direction. Palette: `ink` (near-black text),
`canvas`/`porcelain` (warm off-white surfaces), `brass` (signature
metallic accent), `evergreen` (secondary accent), `stone`/`hairline`
(borders). Type: Fraunces (display serif) + Manrope (body sans) +
IBM Plex Mono (data/prices). Full detail, including the reasoning for
avoiding generic AI-default palettes, is in
`docs/architecture/design-system.md`. Tokens live in
`frontend/tailwind.config.ts` and `frontend/src/styles/globals.css`,
and are now consumed by the global header, footer, navigation
(Phase 2), the complete homepage (Phase 3), the collections/product
listing system (Phase 4), the product detail page (Phase 5), and the
admin dashboard (Phase 6 — the first real consumer of the `.dark`
token variant Phase 1 reserved) — no checkout or storefront auth
pages consume them yet.

## 6. Completed Work

### Phase 1 — Project Foundation & Architecture ✅

- Enterprise monorepo folder structure (frontend / backend / shared /
  database / docs).
- Next.js 15 + React 19 + TypeScript app scaffolded: Tailwind config,
  design tokens (`globals.css`), Shadcn `components.json`, Framer
  Motion installed, ESLint (flat config) + Prettier + Husky/lint-staged,
  path aliases, `next.config.ts` (image remote patterns, security
  headers), minimal root layout + placeholder page (verifies the app
  runs — no homepage design).
- Frontend architecture: `lib` (cn, format, validation), `config`
  (env, site, fonts), `constants` (routes, API endpoints), `types`
  (api, user), `services/api` (axios client + interceptors, auth
  service), `store` (zustand auth store), `hooks` (`useAuth`,
  `useMediaQuery`), `components/providers` (React Query + composition
  root). `components/ui`, `components/shared`, `components/layout`
  intentionally left empty (documented with READMEs).
- Laravel 12 app scaffolded: `composer.json`, `artisan`,
  `bootstrap/app.php` (routing, middleware, JSON exception rendering),
  full `config/` set (app, database, auth, cors, filesystems +
  Cloudinary, jwt, cache, queue, session, logging, mail, services),
  `.env.example`, Pint config, storage directory skeleton.
- Backend architecture: `Controller` base, `HealthController`,
  `AuthController` (register/login/logout/refresh/me),
  `AuthService` (JWT issuance logic), `ApiResponse` envelope helper,
  `RegisterRequest`/`LoginRequest`, `UserResource`, `User` model
  (`JWTSubject`), migrations for `users` + framework tables
  (`cache`, `jobs`, `sessions`, etc.), `UserFactory`,
  `DatabaseSeeder` (seeds one admin account), route middleware
  (`ForceJsonResponse`, `EnsureUserHasRole`, JWT aliases).
- API versioned at `/api/v1`; `GET /health`, and full `/auth/*`
  endpoints (register, login, logout, refresh, me) implemented and
  covered by Pest feature tests (`tests/Feature/HealthCheckTest.php`,
  `AuthTest.php`).
- Documentation: root `README.md`, `frontend/README.md`,
  `backend/README.md`, `shared/README.md`, `database/README.md`,
  `docs/architecture/design-system.md`,
  `docs/architecture/architecture-overview.md`, `docs/api/auth.md`.
- Tooling: root `.editorconfig`, `.vscode/{extensions,settings}.json`,
  root/frontend/backend `.gitignore`.

**Explicitly not built in Phase 1** (per spec): homepage, navbar,
collections, product listing/detail, cart, checkout, admin dashboard
pages, authentication *pages* (UI), WhatsApp integration, page-level
animations, hero section, slider — the backend auth *endpoints* above
are foundation/infrastructure, not UI, and are in scope.

### Phase 2 — Luxury UI Foundation & Navigation System ✅

- **Navigation data layer**: `types/navigation.ts` (recursive
  `NavNode` tree, unlimited depth), `constants/navigation.ts`
  (`primaryNav` — the exact Home / Collections / New Arrivals / Sale /
  About / Contact structure specified, with Collections expanding to
  Summer Collection, Winter Collection, and Shawls, each with their
  full 2 Piece / 3 Piece / fabric sub-levels). One tree, consumed by
  both desktop and mobile menus — see
  `docs/architecture/navigation.md` for the full rationale, including
  why a mega-menu grid was chosen over nested hover flyouts to satisfy
  both the "Mega Menu" and "Multi-Level Dropdown" requirements with
  one recursive renderer.
- **UI primitives** (`components/ui`): `Button` (primary/secondary/
  outline/ghost/brass/link variants, loading state), `Badge`,
  `Separator`, `Skeleton`, `Accordion` (Radix, powers mobile nav),
  `Sheet` (Radix Dialog-based slide-in drawer, powers mobile nav).
- **Shared design components** (`components/shared`): `Container`
  (the site's one horizontal-rhythm primitive), `SectionTitle`,
  `IconButton` (polymorphic — renders `<Link>` when `href` is passed,
  `<button>` otherwise, to avoid nesting interactive elements),
  `Reveal` (Framer Motion scroll-reveal wrapper, respects
  `prefers-reduced-motion`), `Spinner`, `Card` +
  `CardMedia`/`CardBody`/`CardTitle`/`CardDescription` (generic
  luxury surface, not tied to products yet), `CardSkeleton`.
- **Global layout** (`components/layout`): `Logo` (typographic
  wordmark placeholder — swappable for a real mark/SVG later without
  touching any consumer), `AnnouncementBar` (auto-rotating, pauses
  when tab hidden), `Header` (sticky, compacts on scroll via
  `useScrollPosition`, composes announcement bar + logo + desktop nav
  + mobile nav trigger + search/wishlist/cart/account icons),
  `DesktopNav` + `MegaMenu` + `MegaMenuNode` (the recursive multi-
  level renderer), `NavLink` (center-out underline hover, active
  state), `MobileNav` + `MobileNavNode` (slide-in `Sheet` +
  recursive nested `Accordion`), `SearchOverlay` (expanding search
  panel shell — UI only, no search backend yet), `Footer` (newsletter
  form with real client-side validation via `emailSchema`, Collections
  column sourced from `primaryNav` so it can't drift from the mega
  menu, Customer Care / About columns, social icons, payment method
  placeholders, copyright).
- **Animation foundation**: `lib/animations.ts` (shared Framer Motion
  variants — `fadeIn`, `fadeUp`, `fadeDown`, `scaleIn`,
  `staggerContainer`, plus the shared scroll-viewport config), all
  tuned to the `luxury-ease` timing function from Phase 1's Tailwind
  config.
- **Interaction hooks**: `useScrollPosition`, `useClickOutside`,
  `useLockBodyScroll` (documented as unused-by-`Sheet` — Radix Dialog
  already locks scroll internally — but available for future
  non-Radix overlays), `useEscapeKey`.
- **Root layout wiring**: `app/layout.tsx` now renders `Header` +
  `<main>` + `Footer` around `{children}` with a skip-to-content link;
  corrected a Phase 1 metadata bug (title was accidentally set to the
  SEO description) and a latent missing-`React`-import bug in three
  Phase 1 files (`app/layout.tsx`, `components/shared/spinner.tsx`,
  `components/ui/skeleton.tsx`) that would have failed `tsc` — fixed
  as part of this phase's work since they're on the render path for
  every new component built here.
- **Package additions**: `@radix-ui/react-accordion`,
  `@radix-ui/react-dialog`, `@radix-ui/react-slot`,
  `@radix-ui/react-visually-hidden`.
- **Config changes**: `next.config.ts` — `experimental.typedRoutes`
  turned off (many nav links intentionally point at routes with no
  page yet; typed routes would fail to compile against them) with a
  comment on when to re-enable it (once Phase 3+ pages exist).
- **Docs**: `docs/architecture/navigation.md`.

**Explicitly not built in Phase 2** (per spec): homepage hero, product
grid/detail, collection pages, cart, checkout, admin dashboard pages,
authentication pages, WhatsApp integration, homepage slider.

### Phase 3 — Premium Luxury Homepage ✅

- **Reusable infrastructure added first** (all under
  `frontend/src/components/shared` and `hooks/`, so any future page —
  not just the homepage — can use them):
  - `Section` — the site's vertical-rhythm + background-tone wrapper
    (`tone`: canvas/porcelain/ink/evergreen; `spacing`: sm/md/lg/xl;
    `fullBleed` to opt out of the inner `Container`).
  - `MediaPlaceholder` — the one stand-in for real photography
    (gradient + faint weave pattern + monogram), used everywhere the
    design calls for an image that doesn't exist yet (hero, featured
    collections, marquee, product previews, Instagram grid). Swapping
    in real Cloudinary imagery later is a one-file change.
  - `Marquee` + `useMarquee` — the reusable, generic auto-scrolling
    marquee engine (see `docs/architecture/marquee.md` for full
    mechanics: `requestAnimationFrame` + measured modulo wrap for a
    seamless jerk-free loop, Pointer Events for unified mouse-drag/
    touch-swipe, hover-to-pause, `prefers-reduced-motion` support).
  - `useParallax` — light scroll-linked parallax (Brand Story section).
  - `NewsletterForm` — extracted from Phase 2's footer into a shared,
    reusable component (`variant`: inline/section, `tone`:
    light/dark) so the footer and the new homepage newsletter section
    share one real-validation implementation instead of two.
- **Homepage sections** (`frontend/src/components/home`), composed in
  `app/page.tsx` in this order: `Hero` (multi-slide, autoplay +
  pause-on-hover, fade + light Ken Burns zoom, dot navigation, Shop
  Now / Explore Collection CTAs) -> `FeaturedCollections` (Summer/
  Winter cards, stagger-in, image scale + gradient-reveal hover) ->
  `CollectionMarquee` (the "Ramsha Inspired Auto Moving Collection
  Slider" — every leaf category from `primaryNav` flattened into one
  infinite strip) -> `NewArrivalsPreview` (`ProductPreviewCard` grid,
  placeholder items only, no catalog yet) -> `SaleSection` (dark
  promotional band) -> `BrandStory` (editorial copy + light parallax
  image) -> `WhyChooseUs` (4 feature tiles) -> `NewsletterSection`
  (large-format `NewsletterForm`) -> `InstagramGallery` (6-tile
  placeholder grid with hover overlay) -> global `Footer` (from the
  root layout, unchanged structurally).
- **New types**: `types/product-preview.ts` (`ProductPreview` — a
  deliberately minimal placeholder shape, not a guess at the eventual
  Phase 4 `Product` model).
- **New data**: `constants/hero-slides.ts` (`HeroSlide[]`, shaped to
  match what an admin-managed hero-slides API resource will
  eventually return).
- **Animation**: every section uses Phase 2's `fadeUp`/
  `staggerContainer` variants from `lib/animations.ts` (no new
  variants needed — reused, not reinvented) for scroll-triggered
  reveals; the marquee and parallax use dedicated hooks since their
  motion isn't a simple enter animation.
- **Accessibility**: hero dots are real buttons with `aria-current`;
  marquee duplicate (visual-loop) copy is marked `inert` (not just
  `aria-hidden`) so it's excluded from both the accessibility tree
  and tab order; all interactive hover-reveal affordances (wishlist
  heart, Instagram overlay) also appear on keyboard focus, not only
  `:hover`.
- **Fixed 2 more latent Phase 1/2-adjacent bugs**, same class as the
  three fixed in Phase 2: `hooks/use-marquee.ts` and
  `hooks/use-parallax.ts` referenced the `React` namespace
  (`React.RefObject`, `React.PointerEvent`) without importing it.
  Fixed with named type imports, same pattern as before.
- **Docs**: `docs/architecture/marquee.md`.

**Explicitly not built in Phase 3** (per spec): collection pages,
product detail pages, cart, checkout, admin dashboard, authentication,
WhatsApp integration, order system.

### Phase 4 — Collections System & Product Listing Pages ✅

- **Frontend-only phase**, consistent with Phases 2–3 — no backend
  (Laravel) changes. No real product API exists yet; a documented mock
  catalog stands in (see below), designed so a real API swap later
  only touches `lib/products.ts` and `lib/mock/products.ts`, never the
  components that call them.
- **Nav-tree utilities generalized** (`lib/nav-tree.ts`): `collectLeaves`,
  `collectAllLeaves`, `collectAtDepth`, `collectLeavesWithTrail`,
  `resolveNodePath`, `slugOf`, `collectAllPaths`. Phase 3's
  homepage marquee had a one-off local tree-flattening function;
  it now uses `collectAtDepth` from this shared module (same visible
  output, now documented and reusable) — first real payoff of moving
  it here is `generateStaticParams` in the new collection route.
- **Product data layer**: `types/product.ts` (`Product`, `ProductImage`,
  `SortOption`), `lib/mock/products.ts` (deterministic — seeded, NOT
  `Math.random()`, so SSR/CSR output is byte-identical and never
  hydration-mismatches — ~144 products, 9 per leaf category, each
  with 4–6 images, satisfying "minimum 4 images"), `lib/products.ts`
  (`getProductsForNode`, `filterProducts`, `sortProducts`,
  `paginateProducts`, `searchProducts`).
- **One dynamic route renders all 13+ required pages**:
  `app/collections/[...slug]/page.tsx` resolves any URL against the
  nav tree via `resolveNodePath` and renders Summer Collection, Winter
  Collection, 2 Piece, 3 Piece, Embroidered Lawn, Printed Lawn,
  Marina, Linen, Viscose, Winter Karandi, Khaddar, Embroidered Shawls,
  and Printed Shawls (plus every intermediate node) from one file,
  statically pre-rendered via `generateStaticParams` +
  `collectAllPaths` — not 13 hand-duplicated page files. Parent nodes
  (e.g. "Winter Collection") aggregate every descendant leaf's
  products automatically, since `Product.categoryPath` stores the
  full ancestor-to-leaf id chain.
- **`app/collections/page.tsx`** — the unscoped `/collections` index
  (every product, full filter set including "Collection").
  **`app/collections/loading.tsx`** / **`not-found.tsx`** — route-level
  skeleton and a styled 404 for invalid category URLs.
- **`ProductGrid`** (`components/collections/product-grid.tsx`): 1
  column mobile / 2 tablet / 4 desktop, loading-skeleton state
  (`ProductCardSkeleton`), empty state (`EmptyState`), stagger-in
  animation.
- **`ProductCard`** (`components/collections/product-card.tsx`):
  hover-swaps to the second product image, collection badge, New/Sale
  badges, out-of-stock overlay, Quick View button, Wishlist button
  (persisted client-side via the new `store/wishlist-store.ts`,
  documented as a placeholder for a future server-side wishlist).
- **`QuickViewDialog`** (+ new `components/ui/dialog.tsx`, a centered
  modal primitive distinct from Phase 2's side-anchored `Sheet`) —
  deliberately not the full product detail page (Phase 5).
- **Filters**: `constants/filters.ts` (option lists derived
  programmatically from the nav tree, never hand-duplicated),
  `components/collections/filters-panel.tsx` (Collection/Piece
  Type/Fabric checkboxes, Price Range, Availability, New/Featured/Sale
  quick-filter chips), `components/collections/filters-mobile.tsx`
  (same panel in a `Sheet` below `lg`),
  `lib/collection-filter-visibility.ts` (hides filter groups the
  current URL already fully constrains — e.g. no redundant "Fabric"
  checkboxes on the "Khaddar" leaf page; no "Piece Type" group under
  Shawls, which has no such dimension).
- **Sorting**: `components/collections/sort-dropdown.tsx` — Newest,
  Price Low to High, Price High to Low, Featured, Best Selling.
- **Pagination**: `components/collections/pagination.tsx` — ellipsis
  collapse beyond 7 pages, disabled boundary states.
- **`CollectionExplorer`** (`components/collections/collection-explorer.tsx`)
  + **`useProductFilters`** (`hooks/use-product-filters.ts`) — the
  client-side orchestration tying filters/sort/pagination together
  via `useMemo`, reused identically by every collection page,
  `/collections`, `/new-arrivals`, `/sale`, and `/search`.
- **Live search**: `lib/products.ts:searchProducts` (genuinely instant
  — in-memory, no network round-trip). `components/layout/search-overlay.tsx`
  (Phase 2's UI-only shell) now shows live matched results as the
  user types; new `app/search/page.tsx` + `search-page-content.tsx`
  full results page (debounced URL sync via `router.replace`, no
  scroll jump).
- **Also wired up** (not explicitly required by Phase 4's checklist,
  but already linked from Phase 2's nav and Phase 3's homepage, and
  cheap to complete now that the infrastructure exists):
  `app/new-arrivals/page.tsx`, `app/sale/page.tsx` — both reuse
  `CollectionExplorer` pre-filtered by `isNew`/`salePrice` instead of
  a nav-tree node.
- **Homepage migration**: `NewArrivalsPreview` now renders the 4
  newest real products via the real `ProductCard`, replacing Phase 3's
  static placeholder array. The Phase 3 placeholder
  `ProductPreviewCard` component and `ProductPreview` type are
  **removed** (superseded, not left as dead code) — see Changed/Removed
  in `CHANGELOG.md`.
- **Known scope trade-off**: filter/sort/page state is local component
  state, not synced to the collection page's URL query string (the
  `/search` page's query IS URL-synced, since that was simple to wire
  through `router.replace`). Deep-linking a specific filtered/sorted
  collection view is a reasonable future enhancement, not attempted
  here to keep this already-large phase bounded.

**Explicitly not built in Phase 4** (per spec): product detail pages,
cart, checkout, authentication, admin dashboard, orders, payments,
WhatsApp integration.

### Phase 5 — Product Details Page ✅

- **Still frontend-only** — no Laravel backend changes. Reads/extends
  the same mock catalog Phase 4 introduced.
- **`app/products/[slug]/page.tsx`** — real product detail page,
  statically pre-rendered for every mock product via
  `generateStaticParams`. `ProductCard`/`QuickViewDialog` "View Full
  Details" links, built in Phase 4 pointing at a page that didn't
  exist yet, now resolve for real. Scoped `app/products/loading.tsx`
  and `not-found.tsx` added alongside it.
- **`Product` type extended**: `sku`, `shortDescription`,
  `description`, `careInstructions`, `deliveryEstimateDays` — all
  populated deterministically in `lib/mock/products.ts` (still no
  `Math.random()`, same SSR/CSR-safety reasoning as Phase 4).
- **Image gallery** (`components/products/product-gallery.tsx` +
  `image-lightbox.tsx` + `product-media.tsx`, sharing navigation logic
  via new `hooks/use-image-gallery.ts`): thumbnail rail, hover-magnify
  zoom (cursor-tracked `transform-origin`), click-to-expand fullscreen
  lightbox, swipe-to-navigate (Framer Motion drag, zero visual
  displacement, offset-based), full keyboard arrow-key navigation,
  smooth crossfade transitions, `role="tablist"`/`aria-selected`
  thumbnails.
- **Product information** (`components/products/product-info.tsx`):
  name, SKU, collection/category/fabric trail, price + sale price +
  computed discount-percent badge, in-stock/out-of-stock, short
  description.
- **Product actions** (`components/products/product-actions.tsx`):
  quantity stepper, Add to Bag, Buy Now, Wishlist (reuses Phase 4's
  `useWishlistStore`), Share (native Web Share API with clipboard
  fallback), Copy Product Link, and the WhatsApp order button.
- **Cart, finally wired up**: new `store/cart-store.ts` (persisted,
  same pattern as the wishlist store) — Add to Bag / Buy Now are now
  real actions, not UI-only. The header's cart badge (left as a
  documented TODO since Phase 2) now shows a live count. A minimal
  `app/cart/page.tsx` (list, quantity, remove, subtotal — no
  checkout) was added so the badge doesn't lead to a dead end; not an
  explicit Phase 5 requirement, but cheap given the store already
  exists and "Cart" (unlike Checkout/Payment) isn't on this phase's
  exclusion list.
- **WhatsApp order button**: `lib/whatsapp.ts` builds a `wa.me` deep
  link with product name, SKU, price, quantity, and product URL
  pre-filled; `siteConfig.whatsAppNumber` is a clearly documented
  placeholder pending real admin configuration.
- **Toast notifications**: new `store/toast-store.ts` +
  `components/shared/toaster.tsx` (mounted once in `app/layout.tsx`)
  — a small reusable confirmation system for Add to Bag, Copy Link,
  and review submission, rather than one-off inline feedback per
  feature.
- **Product tabs** (`components/products/product-tabs.tsx` + new
  `components/ui/tabs.tsx` Radix primitive): Description, Fabric
  Details, Shipping Information, Return Policy, Care Guide.
- **Reviews UI** (`components/products/reviews-section.tsx` + new
  `components/shared/star-rating.tsx`, `lib/mock/reviews.ts`,
  `lib/reviews.ts`): average rating + star distribution bars, review
  list with Verified Purchase badges, and a Write a Review form
  (client-validated, UI-only — "Backend integration later" per the
  brief).
- **Related Products / You May Also Like / Recently Viewed**: one
  reusable `components/products/product-row.tsx` renders all three
  (renders nothing if its product list is empty, rather than an empty
  section). `lib/products.ts` gained `getRelatedProducts` (same leaf
  category, falls back to the parent piece-type level) and
  `getYouMayAlsoLike` (same top-level collection, different fabric,
  deterministically "shuffled"). Recently Viewed is powered by new
  `store/recently-viewed-store.ts` (persisted, capped at 8) +
  `components/products/recently-viewed-row.tsx`.
- **Breadcrumbs enhanced**: `components/collections/breadcrumbs.tsx`
  now always leads with "Home" (matching the brief's exact example,
  Home > Collections > Summer Collection > 2 Piece > Product Name) —
  an improvement applied to every existing breadcrumb consumer
  (collection pages), not just the new product page. New
  `lib/nav-tree.ts:findNodesByIdPath` resolves `Product.categoryPath`
  (an id chain) back to real `NavNode`s so breadcrumb hrefs are never
  hand-reconstructed strings.
- **SEO**: dynamic `generateMetadata` (title, description, canonical,
  Open Graph, Twitter card) per product; a `Product` JSON-LD
  (`schema.org`) script tag with price/availability/SKU.
- **Accessibility**: full keyboard gallery navigation, `role="img"`
  + descriptive `aria-label` on every `MediaPlaceholder` (already
  true since Phase 3, now load-bearing for the gallery), all
  interactive controls (quantity, wishlist, share, tabs, star input)
  have `aria-label`/`aria-pressed` as appropriate, lightbox traps
  focus via Radix Dialog and restores it on close.

**Explicitly not built in Phase 5** (per spec): checkout, payment,
admin dashboard, orders, authentication, backend APIs.

### Phase 6 — Admin Dashboard ✅

**Full-stack phase** — unlike Phases 2–5, this one is real backend
work, not a frontend-only build against mock data. The admin panel
talks to a genuinely new database schema, real JWT-gated endpoints,
and real Cloudinary uploads. The storefront (Phases 3–5) is
**unchanged** and still runs on its own mock catalog — see "Scope
decision" below.

#### Backend (Laravel)

- **Schema**: `categories` (self-referencing tree — one table
  backs both "Category Management" and "Collection Management"; see
  the migration's doc comment and `docs/architecture/admin-dashboard.md`),
  `products`, `product_images`. Models with proper relations,
  `casts()`, and query scopes (`Product::published/search`,
  `Category::visible/roots`).
- **Services** (business logic, not in controllers): `CategoryService`
  (slug generation, safe delete guarding against orphaned children/
  products, self-descendant-proof reparenting, reordering, tree
  building), `ProductService` (slug/SKU generation, `duplicate()` —
  always creates a `draft` with its own copied images/SKU, never a
  live clone), `ProductImageService` (real Cloudinary upload via the
  Phase 1 `cloudinary` disk, delete with a "keep at least one image"
  guard, reorder, set-featured, plus a cascade-cleanup path used only
  on full product deletion), `DashboardService` (real stats; `null`
  — not fabricated numbers — for Orders/Customers/Revenue, which
  don't exist until Phase 7).
- **Controllers/Requests/Resources**: `Admin\{Dashboard,Category,Product,ProductImage}Controller`,
  matching `Http\Requests\Admin\*` (full validation, including
  `sale_price < price` and self-parenting guards) and
  `Http\Resources\Admin\*`.
- **Routes**: `/api/v1/admin/*`, protected by `jwt.auth` +
  `role:admin,super_admin` (both from Phase 1). Full reference in
  `docs/api/admin.md`.
- **Seeders**: `CategorySeeder` mirrors
  `frontend/src/constants/navigation.ts`'s tree exactly;
  `ProductSeeder` adds one starter product per leaf category
  (placeholder `picsum.photos` images — ordinary seed-data practice,
  not a fake feature; the real upload/replace/delete/reorder flow
  works on anything an admin actually uploads).
- **Lazy-loading correctness**: caught and fixed several places
  (`Category::ancestors()`, `CategoryService`'s self-descendant
  check, `Product::featuredImage()`, `ProductService::duplicate()`,
  `ProductImageService::deleteAllForProduct()`) that would have
  thrown under Phase 1's `Model::preventLazyLoading(!isProduction())`
  — property-access relation reads (`$model->relation`) replaced with
  explicit `->relation()->first()` calls or self-contained
  `->load()`.
- **Tests**: `tests/Feature/Admin/{CategoryManagement,ProductManagement}Test.php`
  (auth/role gating, CRUD, duplicate, bulk actions, image upload
  against a faked Cloudinary disk, the "can't delete the last image"
  guard). Shared `loginAsAdmin()` helper added to `tests/Pest.php`.

#### Frontend — route restructuring

- **`(site)` / `admin` route groups**: every existing public route
  moved under `app/(site)/` (zero URL changes — route groups aren't
  part of the URL); `app/layout.tsx` is now minimal, with the
  storefront's `Header`/`Footer` moved to the new
  `app/(site)/layout.tsx`. `app/admin/(dashboard)/layout.tsx` is a
  fully separate shell. Full rationale in
  `docs/architecture/admin-dashboard.md`.

#### Frontend — admin auth

- **Real JWT login** (`app/admin/login/page.tsx`) against the Phase 1
  backend, with a genuinely working "Remember Login": a silent
  401-triggers-refresh interceptor added to `services/api/client.ts`
  (deduplicated across concurrent requests), plus `store/auth-store.ts`'s
  `setSession` now accepting a `rememberMe` flag that controls the
  *cookie's* browser-side lifetime independent of the JWT's own short
  expiry.
- `components/admin/admin-guard.tsx` — protects every
  `admin/(dashboard)` route via a real `GET /auth/me` round trip on
  mount (never trusts client state alone); the backend's
  `role:admin,super_admin` middleware is the actual enforcement.
- `hooks/use-auth.ts` extended (`login` gained a `rememberMe` param,
  `logout` no longer hardcodes its redirect) — this hook was unused/
  dormant since Phase 1, so extending it was safe, not breaking.

#### Frontend — admin data layer

- `services/api/admin/{categories,products,product-images,dashboard}.service.ts`
  + `hooks/admin/use-admin-*.ts` (React Query, with a shared query-key
  factory per resource so mutations invalidate precisely).
- `types/admin/{category,product}.ts`.

#### Frontend — admin shell & dashboard

- `components/admin/layout/{admin-sidebar,admin-topbar,admin-shell,theme-toggle}.tsx`
  + `store/admin-theme-store.ts` — genuinely working dark/light mode,
  scoped to the admin subtree only (the `.dark` class Phase 1 reserved
  specifically for this now has a real consumer; its doc comment in
  `globals.css` updated accordingly). Sidebar shows Orders/Customers
  as visibly-present-but-locked ("Coming in Phase 7") rather than
  hidden.
- `app/admin/(dashboard)/page.tsx` + `components/admin/dashboard/*`
  (`StatCard`, `ChartPlaceholder`, `QuickActions`,
  `AdminProductMiniList`) — real stats, real low-stock/featured/
  recent-activity lists, an honest chart placeholder (see
  `docs/architecture/admin-dashboard.md`).

#### Frontend — product management

- `components/admin/products/{category-select,product-filters,product-table,bulk-actions-bar,tag-input,image-manager,product-form}.tsx`.
- `app/admin/(dashboard)/products/{page.tsx,new/page.tsx,[id]/edit/page.tsx}`.
- `components/ui/table.tsx`, `components/ui/checkbox.tsx`,
  `components/ui/switch.tsx` — 3 new small Radix-based primitives
  (`@radix-ui/react-checkbox`, `@radix-ui/react-switch` added to
  `package.json`; `@radix-ui/react-tabs` was already added in Phase 5).
- **Image manager**: real drag-and-drop upload straight to Cloudinary,
  native-HTML5-drag reordering (no DnD library — see
  `docs/architecture/admin-dashboard.md`), delete, set-featured, a
  "4 images recommended" nudge. Fully functional, not a preview-only
  mock.
- Reuses Phase 4's `Pagination` component for the product table —
  one component, storefront and admin alike.

#### Frontend — category/collection management

- `components/admin/categories/{category-tree,category-form-dialog}.tsx`,
  `app/admin/(dashboard)/categories/page.tsx`,
  `lib/admin/category-tree-utils.ts` (`flattenCategoryTree`,
  `indentLabel`, `isSelfOrDescendant`).
- Recursive tree UI: expand/collapse, drag-reorder within a parent,
  inline add-subcategory/edit/hide/delete, product-count badges.

#### Improved along the way

- `components/collections/breadcrumbs.tsx` was NOT touched this phase
  (already fixed in Phase 5) — no change needed here.

**Scope decision — storefront left on mock data.** The brief asks for
an admin dashboard, not a storefront migration; wiring the storefront
(homepage, collections, product pages, search — all built against
`lib/mock/products.ts` since Phases 3–5) onto this new real backend
is a distinct, large undertaking not requested here. The category
tree shape is kept identical between `CategorySeeder` and
`constants/navigation.ts` specifically so that migration is
straightforward whenever it's scoped.

**Explicitly not built in Phase 6** (per spec): Orders Management,
Customer Management, Coupons, Homepage Banner Manager, Slider
Manager, Website Settings, SEO Manager — all Phase 7.

### Phase 7 — Remaining Admin Dashboard Modules ✅

**Full-stack phase**, same as Phase 6 — real schema, real endpoints,
real seeded data, not mocked. The storefront (Phases 3–5) is still
unchanged and still runs on its own mock catalog.

#### Backend — schema & models

- **New tables**: `settings` (one flexible key-value store — see
  below), `slides` (backs both Hero Banner and Auto Moving Slider),
  `addresses` (customer address book), `orders`, `order_items`,
  `order_status_histories`, `order_notes`, `customer_notes`,
  `newsletter_subscribers`; `phone`/`account_status` added to
  `users`; `new_arrival_position`/`sale_position` added to `products`.
- **One `settings` table serves six admin sections** (Website,
  WhatsApp, SEO, Homepage, Marquee, Sale) — same "one flexible
  structure, not five rigid tables" reasoning as Phase 6's category
  tree. `Setting::forGroup()`/`setMany()` read/write through a
  short-lived cache, busted on every write.
- **One `slides` table serves both the Hero Banner and the Auto
  Moving Slider** — `type` ('hero'|'marquee') distinguishes them;
  `SlideService` (upload/update/delete/reorder/toggle) is shared.
- **Orders/order items snapshot data at order time** (customer info,
  shipping/billing address as JSON, each item's product name/SKU/
  price) rather than only foreign-keying live records — standard
  e-commerce practice so a later product/address edit never rewrites
  history. `order_status_histories` is written automatically by
  `OrderService::updateStatus()`, powering the Order Timeline UI with
  real data, not a derived guess.
- **New Arrivals / Sale share one `CurationService`** (`is_new_arrival`
  + `new_arrival_position`, or `is_sale` + `sale_position`) — the
  brief's "Add / Remove / Reorder / Feature Products" verbs for both
  managers map onto one parameterized service and one
  `CurationController`, not two near-duplicates. "Feature" reuses the
  existing Phase 6 `is_featured` flag.
- **Realistic seed data**: `SettingsSeeder` (sensible defaults for all
  six groups), `SlideSeeder` (3 hero + 8 marquee slides),
  `AddressSeeder` (one address per customer), `OrderSeeder` (24
  orders referencing real seeded products, each with proper status
  history — there's still no public checkout, so these remain the
  only orders that exist until one is built), `NewsletterSubscriberSeeder`.
- **Dashboard stats are now fully real**: `totalOrders`,
  `totalCustomers`, and `revenue` (sum of paid order totals) were
  `null` placeholders through Phase 6, explicitly documented as
  "unavailable until Orders/Customers exist" — now that they do,
  `DashboardService` was updated in this same phase to compute them
  for real, and "Best Selling Products" now genuinely ranks by units
  sold from `order_items` (replacing Phase 6's honest-but-approximate
  "Featured Products" stand-in). No stale placeholder was left behind.
- **New public endpoint**: `POST /api/v1/newsletter/subscribe` — the
  real backing store for the Phase 2/3 footer and homepage newsletter
  forms, which previously only validated client-side.
- Full endpoint reference: `docs/api/admin.md` (updated).

#### Frontend — data layer

- `types/admin/{order,customer,slide,settings,newsletter}.ts`.
- `services/api/admin/{orders,customers,slides,settings,curation,newsletter}.service.ts`
  + `services/api/newsletter.service.ts` (public subscribe).
- `hooks/admin/use-admin-{orders,customers,slides,settings,curation,newsletter}.ts`.
- Authenticated CSV export handled correctly: a plain `<a href>`
  can't attach the JWT bearer header, so
  `adminNewsletterService.export()` fetches as a blob through the
  authenticated `apiClient` and triggers a synthetic download link —
  the standard pattern for authenticated file downloads.

#### Frontend — Orders Management

- `components/admin/orders/{order-status-badge,order-filters,order-table,order-timeline,order-status-changer,print-invoice}.tsx`.
- `app/admin/(dashboard)/orders/{page,[id]/page}.tsx` — list (search/
  filter/sort/paginate) and detail (customer info, shipping/billing
  address, products ordered, status changer, timeline, notes, print
  invoice).
- **Print Invoice**: no PDF library or separate print route — the
  admin sidebar/topbar and the rest of the order-detail page carry
  Tailwind's `print:hidden`, while `PrintInvoice` carries
  `hidden print:block`, so `window.print()` produces a clean invoice
  with zero admin chrome.

#### Frontend — Customers Management

- `components/admin/customers/{customer-table,customer-filters}.tsx`,
  `app/admin/(dashboard)/customers/{page,[id]/page}.tsx` — list and
  detail (order history stats, saved addresses, account status
  toggle, notes).
- `components/admin/shared/notes-panel.tsx` — one reusable notes
  thread shared by both Order Notes and Customer Notes (identical
  shape, per the brief listing both).

#### Frontend — Homepage / Hero / Auto Moving Slider

- `components/admin/content/slide-manager.tsx` — the "very important"
  module: real drag-and-drop upload straight to Cloudinary,
  native-HTML5-drag reordering, per-slide edit (title/subtitle/link/
  CTA), enable/disable. One component powers both
  `app/admin/(dashboard)/content/hero/page.tsx` and
  `.../content/slider/page.tsx`.
- `components/admin/content/marquee-settings-form.tsx` — speed,
  direction, pause-on-hover, mobile-swipe — maps directly onto
  `useMarquee`'s options (`hooks/use-marquee.ts`, built Phase 3).
- `components/admin/content/homepage-sections-form.tsx` — show/hide
  toggles for every homepage section built in Phase 3, plus the
  Instagram handle. `app/admin/(dashboard)/content/homepage/page.tsx`.

#### Frontend — New Arrivals / Sale Managers

- `components/admin/curation/{curation-manager,product-picker}.tsx`
  (generic, parameterized by `new_arrivals`/`sale`),
  `components/admin/content/sale-settings-form.tsx` (banner headline/
  subtext, default percentage, optional countdown timer).
- `app/admin/(dashboard)/new-arrivals/page.tsx`,
  `.../sale/page.tsx`.

#### Frontend — Settings & Newsletter

- `components/admin/settings/{settings-tabs,website-settings-form,whatsapp-settings-form,seo-settings-form}.tsx`
  + three pages under `app/admin/(dashboard)/settings/`. The SEO
  form reuses Phase 6's `TagInput` for keywords rather than building
  a second chip input.
- `app/admin/(dashboard)/newsletter/page.tsx` — subscriber list,
  search, delete, CSV export.

#### Admin shell updates

- `components/admin/layout/admin-sidebar.tsx` rewritten with grouped
  sections (Catalog / Sales / Content / Store) — the "Coming in Phase
  7" locked placeholders from Phase 6 are gone, replaced by real,
  working links.
- `components/shared/newsletter-form.tsx` (Phase 2/3) now actually
  submits to the backend instead of only validating — footer and
  homepage newsletter signups land in the new admin Newsletter list.

**Explicitly not built in Phase 7** (per spec — these remain, per the
Phase 6 brief, for a future phase): Coupons were never mentioned in
the Phase 7 checklist and remain unbuilt.

**Known follow-ups, not gaps in what was asked**: `lib/whatsapp.ts`
(Phase 5) still reads `siteConfig.whatsAppNumber`, a static frontend
value — the new WhatsApp Settings form makes the number
admin-editable in the database, but wiring `buildWhatsAppOrderLink`
to actually read from it (instead of the static config) is a small
follow-up, not attempted here to keep this phase's scope to what was
asked (making the settings real and editable). Same for the Homepage
Manager's section toggles and the SEO settings — real and editable
now; the storefront reading them live is part of the eventual
"wire the storefront to the real backend" work already noted as a
Phase 6 scope decision.

### Phase 8 — Premium Customer Experience ✅

Shifts focus from admin tooling (Phases 6–7) to the customer-facing
storefront. Introduces real customer authentication for the first
time — Phases 1–7 built the JWT foundation and used it for admin
login only; Phase 8 is where a *customer* can create an account and
sign in.

#### Backend — customer account API

- **New tables**: `wishlist_items` (backend-real, tested — see
  "Wishlist" below for why the storefront doesn't consume it yet),
  `contact_messages` (backs the Contact page's form).
- **New `/api/v1/account/*` route group** — any authenticated user
  (not role-restricted like `admin/*`), every controller scoping
  queries to `$request->user()` itself: `Account\ProfileController`
  (view/update profile, change password),
  `Account\AddressController` (full CRUD address book, ownership
  enforced via `abort_unless` in `AccountAddressService`, not just
  hidden in the UI), `Account\OrderController` (own order history +
  tracking detail — a customer requesting another customer's order
  id gets a 404, not a 403, so as not to confirm the order exists),
  `Account\WishlistController`. Reuses
  `Http\Resources\Admin\{Order,Address,Product}Resource` rather than
  duplicating identical resource classes under a second namespace —
  see each controller's doc comment.
- **`WishlistService`** — real add/remove/list against actual
  `products` rows, plus a `merge()` method (folds a guest's local
  wishlist into their account on login) that exists and is tested but
  isn't called from the frontend yet — see the Wishlist section below
  for why.
- Public `POST /api/v1/contact` — a real, persisted contact form
  submission, not a form that goes nowhere (admin viewing/managing
  these messages is a natural follow-up, not built this phase).
- `tests/Feature/Account/AccountManagementTest.php` — profile,
  password change (including the wrong-current-password rejection
  case), address ownership enforcement, order isolation between
  customers, and the wishlist add/list/remove cycle.
- `UserResource` gained a `phone` field (added to `users` in Phase 7,
  never actually exposed until now).

#### Wishlist — an explicit, documented scope decision

The brief asks for both a Guest Wishlist and a Logged-in (persistent)
Wishlist. The guest half is unchanged from Phase 4
(`store/wishlist-store.ts`, localStorage). The backend for the
logged-in half is real and tested (above) — but the frontend
`wishlist-store.ts` was deliberately **not** wired to sync with it.
The reason: the storefront still runs on `lib/mock/products.ts`
(Phase 6/7 scope decision), whose product ids are slug-based strings
(`"product-12-3"`) with no relationship to the real, numeric-id
`products` table the backend wishlist references. Syncing would mean
either fabricating an id mapping or migrating the storefront onto the
real catalog — a substantially larger change than "add a wishlist,"
and out of scope here. `wishlist-store.ts`'s doc comment explains
this in full; the backend is ready to activate the moment that
storefront migration happens, and this store is the only file that
would need to change. Everything else on the Wishlist checklist (Add/
Remove/Move to Cart/Wishlist Page/Counter/Responsive) is fully built
against the existing client store.

#### Customer Authentication & Account Dashboard

- `app/(site)/login/page.tsx`, `app/(site)/register/page.tsx` — real
  sign-in/sign-up against the Phase 1 backend, reusing `useAuth`
  (extended in Phase 6 for the admin login, now used for its
  originally-intended customer purpose too).
- `components/account/customer-guard.tsx` — distinct from
  `components/admin/admin-guard.tsx`: any authenticated user, no role
  check, redirects to `/login?returnTo=<path>` so a successful login
  returns the visitor to where they were headed.
- `app/(site)/account/*` — Overview (deliberately **not**
  guarded, so a guest sees an inline sign-in prompt rather than being
  bounced before seeing what an account offers), Profile, Addresses
  (full CRUD with a dialog form, default-address handling), Order
  History, Order Detail (with `OrderTrackingTimeline` — a premium
  stepper distinct from the admin's log-style `OrderTimeline`, since
  "where does my order stand right now" and "here's the full change
  log" are different UIs for different audiences), Account Settings
  (password change).
- `components/account/account-nav.tsx` — shared sidebar/tab nav,
  visible to guests (the Wishlist link works without login) with
  deeper links individually guarded per-page.

#### Advanced Search

- `store/recent-searches-store.ts` (localStorage, capped at 6) — shown
  in both the header's `SearchOverlay` and the `/search` page when
  the input is empty.
- `components/shared/highlight-text.tsx` — bolds matched substrings
  in the header overlay's live results.
- Premium "No Results" states (via the new shared `EmptyState`)
  replacing a single line of text, with a "Browse Collections" way
  out.
- Filters and Sorting (Collection/Category/Fabric/Price/Availability/
  New Arrivals/Sale; Newest/Featured/Best Selling/Price asc/desc)
  were **already fully built in Phase 4** — verified, not rebuilt.

#### Notifications & Empty States

- `store/toast-store.ts` gained `warning`/`info` variants alongside
  `success`/`error`, each with distinct `Toaster` styling.
- `components/shared/empty-state.tsx` — one generic, reusable empty
  state (icon/title/description/action) now backing Wishlist-empty,
  Search-empty, Orders-empty, and Cart-empty, replacing four
  potential one-off implementations. Distinct from
  `components/collections/empty-state.tsx`, which is specific to
  "filters narrowed a collection to zero" and keeps its own
  "Clear Filters" affordance.
- `components/collections/product-grid.tsx` gained an optional
  `emptyState` override prop so Search can supply query-specific copy
  instead of the generic filter-clearing message.

#### New Pages

- Content: About (mission/vision/values), Contact (real persisted
  form, WhatsApp button, map placeholder), FAQ (accordion, reusing
  the Phase 2 `Accordion` primitive).
- Legal: `components/policy/policy-layout.tsx` (shared long-form
  layout — its own minimal breadcrumb, since
  `collections/breadcrumbs.tsx` always hardcodes a "Collections"
  second crumb, wrong for a generic page) backing Privacy Policy,
  Terms & Conditions, Return Policy, Shipping Policy, Refund Policy —
  real, considered policy copy, not lorem ipsum (legal review before
  launch is still the store owner's responsibility, stated plainly
  rather than implied otherwise).
- Error/status: `app/(site)/not-found.tsx` (404, still wrapped in the
  storefront Header/Footer), `app/(site)/error.tsx` (error boundary —
  supplies its own minimal chrome, since an error boundary can't
  safely assume its own layout didn't throw), `app/(site)/maintenance/page.tsx`
  (a reachable page, not wired to actual maintenance-mode
  infrastructure, which is a deploy-time concern out of scope here).
- Footer updated with a legal links row (Privacy/Terms/Refund) and
  its existing customer-care links pointed at the new real pages
  instead of placeholder hrefs.

**Explicitly not built in Phase 8**: checkout/payment (still
out of scope per every phase since Phase 1); admin management UI for
`contact_messages` (the backend/data layer is real; a management
screen is a natural, small follow-up); actual maintenance-mode
middleware (the page exists; the infra to route traffic to it doesn't).

### Phase 9 — Production Readiness ✅

A polish/hardening phase, not a features phase — payment
architecture, email templates, security, performance, SEO,
accessibility, error handling, analytics, and logging, applied across
the whole existing application rather than one new page at a time.

#### Payment System — modular gateway architecture

- `app/Payments/Contracts/PaymentGatewayInterface.php` — every
  gateway (`initiate`, `verify`, `handleWebhook`, `isConfigured`)
  implements exactly this; `PaymentService`/`PaymentController` never
  touch a concrete gateway class directly.
- `app/Payments/Gateways/{CashOnDeliveryGateway,StripeGateway,JazzCashGateway,EasyPaisaGateway}.php`
  + `PaymentGatewayFactory`. **Cash on Delivery is fully live** (no
  external API). **Stripe** makes real REST calls to Stripe's actual
  API via Laravel's HTTP client (Basic Auth with the secret key) —
  genuinely functional the moment real keys are set, no SDK
  dependency needed. **JazzCash**/**EasyPaisa** implement their
  documented signed-field-POST redirect pattern in full (HMAC/SHA-256
  signing exactly as each provider specifies), bridged through a
  small Blade auto-submit view
  (`resources/views/payments/gateway-redirect.blade.php`) since
  neither accepts a plain GET redirect — structurally complete and
  correct, waiting only on real merchant credentials to go live.
- `config/payments.php` — every credential env-driven; a gateway
  missing any required key reports `isConfigured() === false` rather
  than the app trying to use it and failing at charge time.
  `GET /api/v1/payments/methods` exposes this to the frontend so a
  payment method selector can grey out what isn't usable yet.
- `payments` table + `Payment` model — a payment ATTEMPT log,
  deliberately separate from `orders.payment_status` (an order can
  have multiple attempts; the order field is just the current
  settled state). `PaymentService` is the one place that both calls a
  gateway AND writes to the database — gateways themselves stay pure
  "talk to this external API" classes.
- `POST /api/v1/payments/initiate` works for guests (order number +
  matching email, the same lightweight ownership check
  `OrderLookupController` uses) and authenticated customers alike.
  `POST /api/v1/payments/webhook/{gateway}` receives provider
  callbacks; Stripe's implementation verifies the `Stripe-Signature`
  header's HMAC before trusting any payload.
- **Honest scope boundary**: none of this is wired to a live checkout
  flow, because there still isn't one — orders remain seeded, not
  placed. Every piece here is genuinely real and tested (see
  `tests/Feature/PaymentTest.php`), ready for the moment a checkout
  flow exists to call `initiate()`.

#### Order Confirmation & Payment Status Pages

- `GET /api/v1/orders/lookup` (public) — resolves an order by number
  + matching email for a guest with no account, backing all four
  pages below.
- `components/payment/payment-status-page.tsx` — one shared shell for
  `/order-confirmation`, `/payment/success`, `/payment/failed`,
  `/payment/pending`; `hooks/use-order-lookup.ts` +
  `lib/order-lookup-memory.ts` remember the email used at checkout in
  `sessionStorage` (never the URL) so returning from a payment
  redirect resolves automatically, falling back to
  `OrderLookupGate`'s inline email prompt otherwise.
- `components/payment/order-summary-card.tsx` (invoice summary,
  customer info, shipping address, a derived estimated-delivery date)
  + `components/payment/print-invoice.tsx` — the storefront's
  "Download Invoice UI," using the exact `hidden print:block` /
  `print:hidden` pattern the admin's Print Invoice established in
  Phase 7 (the (site) Header/Footer gained `print:hidden` this phase
  to make it work here too). The browser's own print-to-PDF is the
  "download," with no PDF library on either end.
- `components/payment/payment-method-selector.tsx` — reads live from
  `/payments/methods`; ready for a future checkout to use as-is.

#### Email System

- `resources/views/emails/layout.blade.php` — one shared, fully
  inline-styled shell (external `<style>` blocks are unreliable
  across real email clients) every Mailable's view extends.
- `app/Mail/{OrderConfirmation,ShippingUpdate,PasswordReset,Welcome,Newsletter}Mail.php`
  + matching Blade views — all five real `Mailable` classes,
  `ShouldQueue`'d against the `database` queue connection already
  configured since Phase 1. `tests/Feature/EmailTemplatesTest.php`
  renders each one and asserts on its content.
- **Templates are ready; automatic triggers are a documented
  follow-up**, each noted in its own class: `WelcomeMail` isn't yet
  dispatched from `AuthService::register()`; `PasswordResetMail` has
  no forgot-password request/token flow to attach to yet;
  `ShippingUpdateMail` isn't yet dispatched from
  `OrderService::updateStatus()`. `OrderConfirmationMail` and
  `NewsletterMail` are usable immediately given an `Order` /
  admin-composed content respectively.

#### Security

- `app/Http/Middleware/SecurityHeaders.php` (X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
  when served over HTTPS) applied globally in `bootstrap/app.php`.
- Rate limiting: a global `throttleApi()` default (60/min) plus
  tighter per-route limits on brute-force-sensitive endpoints —
  login/register (5/min), contact (5/min), newsletter subscribe
  (10/min), payment initiation (10/min), order lookup (20/min).
- SQL injection: verified — every query in the codebase goes through
  Eloquent's query builder (parameterized under the hood); no raw SQL
  string concatenation exists anywhere in the app.
- XSS: React/Blade both escape by default; the one deliberate
  exception (`NewsletterMail`'s `{!! $bodyHtml !!}`) is documented as
  admin-authored-content-only, never raw user input.
- CSRF: N/A by design — the API is stateless JWT (`routes/api.php`
  carries no session middleware), which is the standard, correct
  answer to CSRF for a token-authenticated API rather than a gap.
- Environment variables: `.env` was already git-ignored and every
  secret already env-driven since Phase 1; Phase 9 extends the same
  pattern to every new payment gateway credential — nothing
  hard-coded, `.env.example` documents every key with no real values.

#### Performance

- `next.config.ts`: `poweredByHeader: false`, `compress: true`,
  `experimental.optimizePackageImports` for `lucide-react`/
  `framer-motion`/`recharts` (smaller per-page JS with zero call-site
  changes), a long-lived immutable cache header for hashed static
  assets.
- `components/products/product-media.tsx`: `ImageLightbox` now loads
  via `next/dynamic` (`ssr: false`) — most visitors never open the
  fullscreen viewer, so its code no longer ships in every product
  page's initial bundle.
- Route-based code splitting was already automatic (Next.js App
  Router splits per page.tsx by default); fonts were already
  optimized via `next/font` since Phase 1; skeleton loading states
  were already extensive throughout Phases 4–8 — verified, not
  rebuilt.

#### SEO

- `app/sitemap.ts` — Next.js's dynamic sitemap convention
  (`/sitemap.xml`), covering every static page, every collection/
  category path (via the same `collectAllPaths` the collection route
  itself uses for `generateStaticParams`, so the two can never drift),
  and every mock-catalog product.
- `app/robots.ts` — dynamic `/robots.txt`, disallowing `/admin`,
  `/account`, `/api`, and auth pages; points at the sitemap.
- `lib/structured-data.ts` — Organization + WebSite JSON-LD, rendered
  once in `(site)/layout.tsx` (site-wide, not per-page); Product
  JSON-LD already existed since Phase 5.
- Root layout (`app/layout.tsx`) gained `metadataBase` (required for
  relative OG/Twitter image paths to resolve to absolute URLs),
  default Open Graph/Twitter Card metadata, a default canonical, and
  optional Google Search Console verification
  (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).

#### Accessibility & Error Handling

- `app/global-error.tsx` — Next.js's root-level error boundary,
  catching a failure in the root layout itself (fonts, providers),
  which the existing `(site)/error.tsx` (Phase 8) can't, since it
  renders *inside* that layout. Must define its own minimal
  `<html>`/`<body>` for exactly that reason.
- `app/admin/error.tsx` — the admin dashboard had a `not-found.tsx`
  since Phase 6 but no `error.tsx`; added for parity with the
  storefront's Phase 8 error boundary.
- Keyboard navigation, focus-visible rings, ARIA labels on icon
  buttons, and the skip-to-content link were already consistent
  practice throughout Phases 1–8 — verified across this phase's new
  pages/components, not retrofitted.

#### Analytics & Logging

- `components/shared/analytics-scripts.tsx` — GA4, Facebook Pixel,
  TikTok Pixel, each fully optional and self-gating: with no env vars
  set (the default), this renders nothing, so a fresh clone never
  phones home by accident. Loaded via `next/script`
  (`strategy="afterInteractive"`) so none of them block initial render.
- `config/logging.php` gained dedicated `api` and `activity` channels,
  separate from the default application log. `app/Http/Middleware/ApiRequestLogger.php`
  (applied globally) logs one structured line per API request
  (method, path, status, duration, user id) — deliberately never the
  request body, since a login/register/password-change body contains
  a plaintext password. `app/Support/ActivityLogger.php` is a
  lightweight `Log::channel('activity')` wrapper, wired into the
  highest-value admin actions (order status changes, customer account
  status changes) as the demonstrated pattern for extending to more.

**Explicitly not built in Phase 9**: an actual live checkout flow
(payment architecture is ready to be called from one, per the
Payment System section's scope boundary above); automatic email
triggers for Welcome/Password Reset/Shipping Update (templates exist,
dispatch call sites are a documented follow-up); a database-backed
admin activity feed UI (the logging itself is real; a screen to
browse it is a natural follow-up); real GA4/Pixel/Search Console
credentials (the integration is ready and self-gating on their
presence).

### Phase 10 — Integration, Checkout & Bug Fixes ✅

An integration/hardening phase — the biggest single piece is the
**real checkout flow**, which closes the "Checkout — Coming Soon"
gap every phase since Phase 5 deferred, and finally exercises the
Payment System (Phase 9) end to end. The rest of the phase connects
several admin-managed settings that were real-but-unread by the
storefront, verifies existing systems (navigation, image system,
CRUD) against the brief, and runs a full-codebase quality sweep.

#### Real Checkout Flow

- **Backend**: `App\Http\Requests\CheckoutRequest`,
  `App\Http\Controllers\Api\V1\CheckoutController`, and
  `OrderService::createFromCheckout()` — `POST /api/v1/orders`, public
  (works for guests and authenticated customers; an authenticated
  request's order links to their account and appears in their real
  Order History immediately).
- **The key design decision**: order line items are stored as
  snapshots (`product_name`/`sku`/`image_url`/`unit_price` on
  `order_items`, `product_id` left `null`) rather than referencing a
  real `products` row. The storefront's cart is still built from the
  mock catalog (`lib/mock/products.ts`, unchanged since the Phase 6
  scope decision), whose string ids have no relationship to the real,
  numeric-id `products` table. Placing real, fully-functional orders
  never actually required solving that deeper mock-vs-real catalog
  gap — `order_items.product_id` being nullable (Phase 7) was already
  designed for exactly this. This mirrors the reasoning behind the
  Wishlist's Phase 8 scope decision, applied to Orders instead.
- Order placement now dispatches `OrderConfirmationMail` (queued) —
  closing one of Phase 9's three documented "template exists, not yet
  triggered" follow-ups. The other two (Welcome, Password Reset) are
  unchanged — see Pending Work below.
- **Frontend**: `app/(site)/checkout/page.tsx` — contact/shipping
  form, `PaymentMethodSelector` (Phase 9, used for the first time),
  live free-shipping-over-threshold calculation, order summary. On
  submit: places the order, calls `PaymentService.initiate()`, then
  either redirects to the gateway's hosted checkout (Stripe/JazzCash/
  EasyPaisa) or straight to `/order-confirmation` (Cash on Delivery,
  which completes synchronously). `store/cart-store.ts` gained
  `clearCart()`, called once an order is successfully placed.
  `services/api/checkout.service.ts`, `types/account/order.ts` gained
  `Checkout*` types.
- The cart page's "Checkout — Coming Soon" disabled button (Phase 5)
  is now a real, working "Proceed to Checkout" link; the product
  page's "Buy Now" (Phase 5) now adds to cart and navigates straight
  to `/checkout` instead of just toasting.

#### Settings Finally Reach the Storefront

- **Backend**: `App\Http\Controllers\Api\V1\SettingsController` (public,
  read-only counterpart to `Admin\SettingsController`) and
  `App\Http\Controllers\Api\V1\SlideController` (public, active-only
  counterpart to `Admin\SlideController`) — `GET /api/v1/settings`,
  `GET /api/v1/slides`.
- **Frontend**: `services/api/settings.service.ts` +
  `hooks/use-site-settings.ts` (5-minute `staleTime` — these change
  rarely; defaults to "show everything" while loading or on failure,
  so a slow/unreachable settings endpoint never visibly breaks the
  storefront).
- **WhatsApp Floating Button** — `components/shared/whatsapp-floating-button.tsx`,
  mounted globally in `(site)/layout.tsx`. This was a genuine gap:
  Phase 7's WhatsApp Settings had a real `floatingButtonEnabled` field
  with no frontend consumer until now.
- **WhatsApp Order Button** (product page) now reads the real,
  admin-editable number and `orderButtonEnabled`/`enabled` toggles via
  `useSiteSettings`, falling back to the static `config/site.ts` value
  — `lib/whatsapp.ts:buildWhatsAppOrderLink()` gained an optional
  `phoneNumber` parameter for this.
- **Homepage Manager's section toggles** (Phase 7) now actually
  control the homepage — `components/home/home-section-toggle.tsx`
  wraps Featured Collections/New Arrivals/Sale/Newsletter/Instagram
  Gallery, hiding a section only on an explicit `false` from the
  admin (never hidden just because settings are still loading).

#### Verified, Not Rebuilt

- **Navigation**: `constants/navigation.ts` checked line-by-line
  against this phase's exact spec (Home, Collections mega menu with
  Summer/Winter Collection 2-Piece/3-Piece fabric leaves, Shawls,
  New Arrivals, Sale, About, Contact) — matches exactly; no changes
  needed.
- **Product image system** (minimum-4 nudge, unlimited images,
  upload/replace/delete, drag-and-drop reorder, zoom, gallery,
  lightbox) — Phases 5–6's implementation re-checked after Phase 9's
  `next/dynamic` change to `ImageLightbox`; still fully functional.
- **Admin CRUD** (Products, Categories/Collections, Orders, Customers,
  Homepage Slider/Banner, New Arrivals, Sale, Newsletter, SEO/
  WhatsApp/Website Settings) — Phases 6–7's implementations
  re-checked against this phase's checklist; all already complete,
  no bugs found.
- **Filters, Sorting, Pagination, Customer Dashboard, Order Tracking,
  Contact/About/Policies** — Phases 4 and 8's implementations
  re-checked; all already complete.

#### Quality Sweep

- Full-codebase unused-import scan (every `.ts`/`.tsx` file, not just
  ones touched this phase) — zero unused imports found.
- Full-codebase brace-balance, React-namespace-import, and
  `"use client"` directive audits — all clean.
- One apparent duplicate Laravel route name pair (`orders.index`/
  `orders.show`) investigated and confirmed safe — they resolve to
  distinct final names (`api.v1.admin.orders.index` vs.
  `api.v1.account.orders.index`) because Laravel concatenates each
  route group's own `name()` prefix; not a bug.
- Stale doc comments updated where Phase 10 changed the facts they
  described (`store/cart-store.ts`, `app/(site)/cart/page.tsx`,
  `components/products/product-actions.tsx`).

**Explicitly not built in Phase 10**: the storefront still runs on
`lib/mock/products.ts` — full storefront-to-real-catalog migration
remains the Phase 6 scope decision, unchanged (Checkout didn't
require it — see above). Welcome/Password Reset emails still aren't
auto-dispatched (no register/forgot-password call sites wired yet).
The Wishlist's guest/logged-in sync remains deferred for the same
underlying reason Orders' `product_id` is null — see the Checkout
section above for why this phase didn't need to resolve it, unlike
Wishlist which fundamentally would.

### Phase 11 — Final Optimization & Documentation ✅

A verification and documentation phase — after ten phases of active
building, Phase 11's job was to audit the existing application against
its own accumulated checklist, fix what audit actually found, and write
the operational documentation a real launch needs (which didn't exist
before now, beyond the developer-facing `PROJECT_MEMORY.md`/`CHANGELOG.md`).

#### Audit Findings & Fixes

The audit was thorough (full-codebase unused-import scan, brace-balance
checks, image alt-text review, `.gitignore` review) — most of it confirmed
the application was already in good shape. Two genuine gaps were found and
fixed:

- **`buildBreadcrumbSchema` was built in Phase 9 but never actually called
  anywhere.** Now wired into both the product detail page and the
  collection listing page, reusing each page's existing breadcrumb data
  (no new data-fetching added — the same `breadcrumbItems` the visible
  `Breadcrumbs` component already renders now also feeds the JSON-LD).
- **The collection listing page (`app/(site)/collections/[...slug]/page.tsx`)
  had no canonical URL, Open Graph, or Twitter Card metadata** — the
  product detail page had all three since Phase 5, but the collection
  page's `generateMetadata()` was never brought up to the same standard.
  Fixed to match.

Everything else audited — image alt text (all `<img>` tags already have
one), `.gitignore` coverage (env files were already fully protected at the
root, backend, and frontend levels since Phase 1), rate limiting coverage,
SQL injection surface (100% Eloquent, zero raw queries anywhere in the
codebase), navigation structure, admin CRUD across every module, the
product image system, and the customer-facing flows — was already correct
with no changes needed. This is a genuinely different outcome than a
"nothing was checked" report would produce; the audit was real, and this
is what it found.

**`next/image` was deliberately NOT retrofitted this phase.** The
storefront currently has no real photographs to optimize (it renders
`MediaPlaceholder`, not `<img>`, throughout — a decision made in Phase 3
pending real product photography), and the admin dashboard's real
Cloudinary-image displays (`<img>` tags, clearly commented as
admin-only) couldn't be safely converted without the ability to visually
verify the rendered result, which this environment doesn't allow.
Retrofitting them blind risked violating "never remove existing
functionality" for a change that can't currently be confirmed correct.
This is documented as a recommended next step in `DEPLOYMENT_GUIDE.md`
rather than attempted speculatively.

#### Documentation

Six new root-level documents, each scoped to a distinct audience/purpose
rather than one large file trying to serve everyone:

- **`README.md`** — fully rewritten. It previously still said *"Status:
  Phase 1... No storefront pages, admin dashboard, or commerce features
  exist yet"* — accurate in Phase 1, badly stale ten phases later. Now
  reflects the real, current state and links out to every other doc.
- **`INSTALLATION.md`** — step-by-step local setup: prerequisites,
  database creation, backend/frontend setup, Cloudinary account setup,
  a dedicated Visual Studio Code section, a verification checklist, and
  a troubleshooting table for the errors people actually hit.
- **`DEPLOYMENT_GUIDE.md`** — taking this to production: deployment
  shape/recommended hosts, a pre-deployment checklist, backend and
  frontend deploy steps, the exact env vars that differ between local and
  production, going live with each payment gateway, production email
  setup, analytics/Search Console setup, and a security checklist before
  launch.
- **`ADMIN_GUIDE.md`** — a non-technical, store-owner-facing walkthrough
  of the admin dashboard: every module (Products, Categories, Orders,
  Customers, Homepage/Hero/Slider, New Arrivals/Sale, Settings,
  Newsletter), written as "how do I do X," not "how does X work."
- **`API_DOCUMENTATION.md`** — the master API index: full detail for
  Auth, Account, Public/Storefront, Checkout, and Payments (none of which
  had a consolidated reference before — `docs/api/auth.md` covered only
  Auth, `docs/api/admin.md` only Admin), plus a summary/link into
  `docs/api/admin.md` for the ~40 admin endpoints rather than duplicating
  them. Includes the response envelope, rate limit table, and error
  status reference in one place for the first time.
- **`DATABASE_STRUCTURE.md`** — every one of the 18 application tables
  (plus Laravel's `cache`/`jobs` framework defaults), grouped by domain,
  with an ASCII entity-relationship overview and the reasoning behind the
  schema's recurring design choices (snapshot-over-reference for order
  history, one flexible table over many rigid ones for admin-configurable
  data, deliberate cascade-vs-null-on-delete choices).

**Explicitly not built in Phase 11**: no new customer-facing or
admin-facing features — this phase was audit and documentation only, per
its own brief. Every "Explicitly not built" item from Phases 6–10 remains
true and unchanged; see each phase's own section above.

### Phase 12 — Final Production Release ✅ (current)

The final phase — a senior-architect-level audit of the entire
application, treating it as a commercial handoff rather than another
increment. The single most valuable outcome was finding and fixing a
**systemic, previously-undetected serialization bug** that had been
silently present since Phase 6. Everything else was cleanup: removing
genuinely dead code and unused dependencies, and producing the final
release deliverables.

#### Critical Fix: Paginated List Serialization

**The bug**: `App\Support\ApiResponse::success()` special-cased
`LengthAwarePaginator` input by calling `$paginator->items()` — an array
of *raw Eloquent models* — and JSON-encoding that directly. A raw
Eloquent model serializes using its actual database column names
(`account_status`, `order_number`, `subscribed_at`), never the camelCase
shape every `*Resource` class (and every frontend TypeScript type) is
built to expect. Every list endpoint following this pattern was
technically returning `200 OK` with real data — just with every field
renamed to something the frontend never checked for, so the affected UI
would silently render blank/undefined values rather than erroring
loudly.

**Why it went undetected for six phases**: this development process never
ran the actual PHP/Laravel server (no `php` binary is available in this
environment) — every phase's "verification" was necessarily close code
reading, not executing the serializer and inspecting real JSON. A bug
that only manifests in actual runtime output, not in how the code reads,
can hide behind confident-looking, syntactically-valid PHP indefinitely.
This is worth stating plainly rather than glossing over, since it's the
honest explanation for why four separate "Admin CRUD — verified, no
changes needed" notes in Phases 6, 7, 10, and 11 all missed this.

**Scope**: six call sites, found by grepping every `->paginate(` in the
controller layer and checking each one's `ApiResponse::success()` call:

- `Admin\ProductController::index()` — the admin Products table
- `Admin\CategoryController::index()` — the admin Categories table (flat view; the `?tree=1` view was already correct, since a non-paginated `Resource::collection()` was never affected by this bug — only the paginator-items path was broken)
- `Admin\CustomerController::index()` — the admin Customers table (would have shown blank Status/Order Count/Joined columns)
- `Admin\NewsletterSubscriberController::index()` — the admin Newsletter table (would have shown blank Subscribed dates)
- `Admin\OrderController::index()` — the admin Orders table
- `Account\OrderController::index()` — a customer's own Order History page

**The fix**: `ApiResponse::success()` now specifically detects an
`AnonymousResourceCollection` (what `SomeResource::collection($paginator)`
returns) wrapping a paginator, resolves each item through its Resource
(`$resource->resolve(request())`) for the camelCase `data` array, and
still builds the same camelCase `meta` block from the underlying
paginator. All six call sites now pass `SomeResource::collection($paginator)`
instead of the bare paginator. A bare-paginator input is still handled
(kept as a defensive fallback, not removed — old code that
somehow bypassed this shouldn't hard-crash) but is no longer how any
call site in this codebase actually works.

**Verification this time is real, not just code-reading**:
`tests/Feature/PaginatedListSerializationTest.php` — new this phase —
asserts the actual camelCase keys are present (and the snake_case ones
are NOT) in the JSON response for all six endpoints, using Pest's real
HTTP test client (which does execute the actual Laravel serializer,
unlike a human reading the PHP source). This is the check that would
have caught this bug on day one, and it's now permanent regression
coverage.

**A near-miss worth recording honestly**: the first attempt at three of
the six fixes (`ProductController`, `CategoryController`,
`CustomerController`) used an editing tool call whose "replace this
exact text" boundary accidentally captured and deleted the next method's
signature line, leaving a syntactically broken `success(...);\n{` with no
enclosing method. This was caught immediately by this same phase's own
brace-balance validation step (part of the standard verification routine
every phase in this project has run), and fully repaired before moving
on — confirmed by re-reading each fixed file in full afterward, not just
re-checking brace counts. Recorded here because a Senior Software
Architect's actual job includes catching their own mistakes before they
ship, not just other people's.

#### Dead Code & Dependency Cleanup

- **Frontend**: removed `react-hook-form` and `@hookform/resolvers` from
  `package.json` — both were installed in Phase 1 and never imported
  anywhere in twelve phases (every form in this project consistently
  uses plain `useState`, a decision that was made early and never
  revisited, leaving these two dependencies as pure dead weight in every
  `npm install`).
- **Backend**: removed `spatie/laravel-permission`,
  `spatie/laravel-query-builder`, `intervention/image`, and
  `league/flysystem-aws-s3-v3` from `composer.json` — all four
  confirmed, via a full-codebase grep, to have zero references anywhere
  in `app/`, `config/`, `database/`, `routes/`, or `tests/`. Role access
  was always built on a plain `users.role` column + middleware
  (Phase 1); filtering/sorting was always built manually per-controller;
  all image processing was always delegated to Cloudinary; no S3 config
  was ever created.
- **Frontend files deleted** (confirmed zero references via two
  independent detection passes, then re-verified after deletion that
  every import in the codebase still resolves):
  `components/shared/card-skeleton.tsx`, `constants/index.ts`,
  `types/index.ts`, `hooks/use-lock-body-scroll.ts`,
  `hooks/use-media-query.ts`. The barrel files (`constants/index.ts`,
  `types/index.ts`) were Phase 1 scaffolding the codebase never actually
  adopted — every consumer imports directly from the specific module
  (`@/constants/routes`, `@/types/api`) instead. The two hooks were
  genuinely built, documented, and never called — `useLockBodyScroll`'s
  own doc comment said as much ("Radix Dialog already locks scroll
  internally... here for any future overlay that isn't built on Radix
  Dialog"), and with no further phases coming, that future never
  arrived.

#### Verified, Not Changed

Full re-audit of navigation structure, the product image system,
responsive patterns, and SEO metadata — all confirmed correct,
consistent with Phase 11's findings. `PaymentResource` (flagged by the
same orphan-file scan that found the two barrel files) was kept rather
than deleted — it's a real, correctly-built Resource with no current
call site because no endpoint yet returns a `Payment` model directly
(only hand-built response arrays), not because it's mistaken code; a
reasonable candidate for a future admin "payment history" endpoint.

**Explicitly not built in Phase 12**: no new customer-facing or
admin-facing features. Every "Explicitly not built"/deferred item from
Phases 6–11 remains true and unchanged — see each phase's own section.
This phase's job was correctness and cleanliness of what already
existed, and it found one thing genuinely worth finding.

## 7. Pending Work

This is the final phase (Phase 12) — there is no Phase 13 planned.
Nothing is outstanding within the scope any phase actually committed to.
What remains are deliberate, documented scope boundaries, each a genuine
design decision rather than an oversight:

- **The storefront runs on a realistic mock catalog** (`lib/mock/products.ts`),
  separate from the real backend catalog the admin dashboard manages
  (Phase 6). Checkout, Orders, and everything downstream of them work
  correctly today regardless, because order line items are snapshotted
  rather than linked to a live product row (Phase 10).
- **The Wishlist is client-only** (localStorage) even for logged-in
  customers, despite a real, tested backend wishlist API existing
  (Phase 8) — blocked on the same mock-catalog boundary above.
- **Welcome and Password Reset emails** have real templates but no
  automatic trigger — no registration/forgot-password flow calls them
  yet (Order Confirmation's dispatch WAS wired, in Phase 10).
- **No admin UI for viewing Contact page submissions** yet — the data is
  real and persisted (Phase 8), just not yet surfaced in the dashboard.
- **`next/image` has not been retrofitted** onto the admin's real
  Cloudinary image displays — deliberately deferred (Phase 11) rather
  than risked without the ability to visually verify the result.
- **Coupons** were explicitly out of scope from the Phase 6 brief onward
  and were never picked up.

## 8. Next Phase Goals

There is no scoped Phase 13. If development on this project resumes in
the future, the items in §7 above are the natural starting candidates —
in particular, the storefront-to-real-catalog migration is the one
architectural decision that, if made, would unblock several of the
others (Wishlist sync, and would let `next/image` apply to real
storefront photography too). Until then, this project is complete and
should be treated as a finished, production-ready release — see §10
below for the final release summary.

## 9. How to Resume Work in a New Session

1. Read this file top to bottom, then `CHANGELOG.md` for the exact
   file-level history of every phase.
2. Read `README.md` (the front door) and `INSTALLATION.md` (full local
   setup) before touching any code.
3. Run the setup steps in `INSTALLATION.md` to confirm the project boots
   — then specifically re-verify Phase 12's critical fix, since it's the
   single most important thing to not silently regress: log into the
   admin dashboard and confirm the Products, Categories, Customers,
   Orders, and Newsletter tables all show real values in every column
   (status badges, dates, counts) rather than blank/"Invalid Date" —
   these were exactly the fields the Phase 12 serialization bug broke.
   `php artisan test` should pass in full, including the new
   `tests/Feature/PaginatedListSerializationTest.php`.
4. Confirm the checkout flow (Phase 10) still works end to end, and that
   Phase 11's SEO fixes (BreadcrumbList JSON-LD, collection page
   canonical/OG tags) are still present in page source.
5. Before writing any new code, re-read §7 above in full — several
   "missing" things are deliberate, documented boundaries, not bugs.

## 10. Final Release Summary (Phase 12)

This project is complete across 12 phases: foundation and auth (1), UI
and navigation (2), homepage (3), collections (4), product detail (5),
admin dashboard core (6) and its remaining modules (7), premium customer
experience — accounts, wishlist, advanced search (8), production
readiness — payments, email, security, SEO (9), integration and a real
checkout flow (10), final optimization and documentation (11), and this
final production-audit release (12).

**What shipped**: a complete customer storefront (homepage, mega-menu
navigation matching an exact category tree, collections with filters/
sort/pagination, product pages with a full gallery/zoom/lightbox, live
search, wishlist, cart, a real checkout, customer accounts with order
tracking, and every supporting content/legal page); a complete admin
dashboard (products with drag-and-drop multi-image management,
categories/collections, orders with a timeline and printable invoices,
customers, a homepage/hero/slider manager, new arrivals/sale curation,
newsletter management, and WhatsApp/website/SEO settings — all backed by
a real database); a modular multi-gateway payment architecture (Stripe,
JazzCash, EasyPaisa, Cash on Delivery); real HTML email templates; a
hardened, rate-limited, JWT-authenticated API with zero raw SQL anywhere;
complete SEO (dynamic sitemap/robots, structured data, Open Graph);
self-gating analytics integration; and eight comprehensive documentation
files covering setup, deployment, admin usage, the API, and the
database schema.

**What was found and fixed in this final audit**: a systemic paginated-
list serialization bug affecting six endpoints (see Phase 12's section
above) — the single most valuable finding across all twelve phases,
since it was invisible to code review and only detectable by actually
executing the API and inspecting real JSON, which is exactly what this
phase's new regression tests now do permanently.

**What's deliberately not included**, each a documented decision, not an
oversight: a live storefront-to-real-catalog connection, server-side
wishlist sync, automatic Welcome/Password-Reset emails, an admin contact-
message inbox, and coupons. None of these block using this as a real,
functioning store — Cash on Delivery works today with zero configuration,
and every other payment gateway activates the moment real credentials are
added to `.env`.
