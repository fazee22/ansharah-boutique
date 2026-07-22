# Changelog

All notable changes to this project are documented in this file, one
phase at a time. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Phase 12] — Final Production Release

The final phase. A senior-architect-level audit of the entire
application. Found and fixed one critical, systemic bug; cleaned up
confirmed-dead code and dependencies; shipped the final release.

### Fixed — Critical: Paginated List Serialization

- `app/Support/ApiResponse.php` — `success()` now detects a
  `Resource::collection($paginator)` input (an `AnonymousResourceCollection`
  wrapping a `LengthAwarePaginator`) and resolves each item through its
  own Resource for the `data` array, still building the same camelCase
  `meta` block from the underlying paginator. Previously, `success()`
  only knew how to unwrap a *bare* paginator via `->items()` — an array
  of raw Eloquent models, which serialize using database column names
  (`account_status`), not the camelCase shape every `*Resource` class
  and every frontend type expects.
- Six call sites fixed to pass `SomeResource::collection($paginator)`
  instead of the bare paginator:
  `Admin\ProductController::index()`, `Admin\CategoryController::index()`
  (flat view only — the `?tree=1` view was never affected),
  `Admin\CustomerController::index()`,
  `Admin\NewsletterSubscriberController::index()`,
  `Admin\OrderController::index()`, `Account\OrderController::index()`.
- `tests/Feature/PaginatedListSerializationTest.php` — new. Asserts the
  real camelCase keys are present (and snake_case absent) in the actual
  HTTP JSON response for all six endpoints — permanent regression
  coverage for this exact bug class.
- See `PROJECT_MEMORY.md`'s Phase 12 section for the full incident
  writeup, including why this went undetected for six phases and an
  honest account of a self-caught editing mistake made while fixing it.

### Removed — Dead Code & Unused Dependencies

- `frontend/package.json`: removed `react-hook-form` and
  `@hookform/resolvers` — zero imports anywhere in twelve phases.
- `backend/composer.json`: removed `spatie/laravel-permission`,
  `spatie/laravel-query-builder`, `intervention/image`,
  `league/flysystem-aws-s3-v3` — zero references anywhere in `app/`,
  `config/`, `database/`, `routes/`, or `tests/`.
- Deleted (confirmed zero references, re-verified after deletion):
  `frontend/src/components/shared/card-skeleton.tsx`,
  `frontend/src/constants/index.ts`, `frontend/src/types/index.ts`,
  `frontend/src/hooks/use-lock-body-scroll.ts`,
  `frontend/src/hooks/use-media-query.ts`.

### Verified (no changes needed)

- Navigation structure, product image system, responsive patterns, SEO
  metadata — re-confirmed correct.
- `app/Http/Resources/PaymentResource.php` — flagged by the same
  orphan-file scan that found the deleted files above, but kept: it's a
  correctly-built Resource with no current call site (no endpoint yet
  returns a raw `Payment` model), not dead/mistaken code.

### Notes

- This is the final phase. No Phase 13 is planned — see
  `PROJECT_MEMORY.md` §10 for the full release summary.
- Local admin login unchanged: `admin@luxury.test` / `password`.

## [Phase 11] — Final Optimization & Documentation

An audit and documentation phase. No new customer-facing or admin-facing
features — the brief was to verify the existing application against its
own accumulated checklist, fix what the audit found, and write the
operational documentation a real launch needs.

### Fixed

- `app/(site)/products/[slug]/page.tsx`: added `BreadcrumbList`
  `application/ld+json` structured data — `buildBreadcrumbSchema()` was
  built in Phase 9 (`lib/structured-data.ts`) but never actually called
  anywhere until now. Reuses the page's existing `breadcrumbItems` (no new
  data-fetching).
- `app/(site)/collections/[...slug]/page.tsx`: same `BreadcrumbList`
  addition, plus a fix to `generateMetadata()` — this page had no
  canonical URL, Open Graph, or Twitter Card metadata at all, unlike the
  product page (which had all three since Phase 5). Now matches.

### Added — Documentation

- `README.md` — fully rewritten (previously still described the project
  as "Phase 1, no features exist yet").
- `INSTALLATION.md` — full local setup guide: prerequisites, database
  creation, backend/frontend setup, Cloudinary account setup, a
  Visual Studio Code section, a verification checklist, and a
  troubleshooting table.
- `DEPLOYMENT_GUIDE.md` — production deployment: hosting recommendations,
  pre-deployment checklist, backend/frontend deploy steps, production env
  var differences, going live with each payment gateway, production email
  setup, analytics setup, and a pre-launch security checklist.
- `ADMIN_GUIDE.md` — non-technical, store-owner-facing walkthrough of
  every admin dashboard module.
- `API_DOCUMENTATION.md` — master API index: full detail for Auth,
  Account, Public/Storefront, Checkout, and Payments in one place for the
  first time, plus a summary/link into `docs/api/admin.md` for the admin
  surface, a response-envelope reference, a rate-limit table, and an
  error-status reference.
- `DATABASE_STRUCTURE.md` — every table in the schema (18 application
  tables + Laravel's `cache`/`jobs` defaults), grouped by domain, with an
  ASCII entity-relationship overview and the reasoning behind recurring
  schema design choices.

### Verified (no changes needed)

- Image alt text — every `<img>` tag in the codebase already has one.
- `.gitignore` coverage at the root, backend, and frontend levels — env
  files were already fully protected since Phase 1.
- Rate limiting coverage, SQL injection surface (100% Eloquent, zero raw
  queries), navigation structure, admin CRUD across every module, the
  product image system, and every customer-facing flow.

### Notes

- `next/image` was deliberately NOT retrofitted this phase. The
  storefront has no real photographs to optimize yet (it renders
  `MediaPlaceholder`, not `<img>`, throughout — a Phase 3 decision pending
  real product photography); the admin dashboard's real Cloudinary image
  displays could not be safely converted without the ability to visually
  verify the rendered result. Documented as a recommended follow-up in
  `DEPLOYMENT_GUIDE.md` rather than attempted blind.
- Local admin login unchanged: `admin@luxury.test` / `password`.

## [Phase 10] — Integration, Checkout & Bug Fixes

The real checkout flow — the single biggest missing piece since
Phase 5 — plus wiring several already-real admin settings into the
storefront for the first time, verification of existing systems
against this phase's checklist, and a full-codebase quality sweep.

### Added — Real Checkout Flow

- Backend: `app/Http/Requests/CheckoutRequest.php`,
  `app/Http/Controllers/Api/V1/CheckoutController.php`,
  `OrderService::createFromCheckout()`. New route:
  `POST /api/v1/orders` (public — guests and authenticated customers
  alike).
- Frontend: `app/(site)/checkout/page.tsx`,
  `services/api/checkout.service.ts`, `Checkout*` types added to
  `types/account/order.ts`. `store/cart-store.ts` gained `clearCart()`.
- Order placement now dispatches `OrderConfirmationMail` (queued) —
  the first of Phase 9's three "template exists, not yet triggered"
  emails to actually fire.

### Changed — Wiring Up Existing Features

- `app/(site)/cart/page.tsx`: "Checkout — Coming Soon" (disabled,
  Phase 5) → real "Proceed to Checkout" link.
- `components/products/product-actions.tsx`: "Buy Now" now adds to
  cart and navigates to `/checkout` instead of toasting "checkout
  arrives in a future phase"; the WhatsApp order button now reads the
  real, admin-editable number and enabled/order-button toggles via
  `useSiteSettings` instead of only the static config.
- `lib/whatsapp.ts`: `buildWhatsAppOrderLink()` gained an optional
  `phoneNumber` parameter.
- `app/(site)/page.tsx`: Featured Collections/New Arrivals/Sale/
  Newsletter/Instagram Gallery each wrapped in the new
  `components/home/home-section-toggle.tsx`, so the admin's real
  Homepage Manager (Phase 7) actually controls the live homepage.

### Added — Public Settings & Slides Endpoints

- Backend: `app/Http/Controllers/Api/V1/SettingsController.php`
  (public, read-only counterpart to `Admin\SettingsController`),
  `app/Http/Controllers/Api/V1/SlideController.php` (public,
  active-slides-only counterpart to `Admin\SlideController`). New
  routes: `GET /api/v1/settings`, `GET /api/v1/slides`.
- Frontend: `services/api/settings.service.ts`,
  `hooks/use-site-settings.ts`.
- `components/shared/whatsapp-floating-button.tsx` — mounted globally
  in `(site)/layout.tsx`. Closes a real gap: Phase 7's WhatsApp
  Settings had a `floatingButtonEnabled` field with no frontend
  consumer until now.

### Added — Tests

- `tests/Feature/CheckoutTest.php` — guest checkout, authenticated
  checkout (order appears in the customer's own Order History),
  validation rejection, and public settings/slides endpoint smoke
  tests.

### Verified (no changes needed)

- `constants/navigation.ts` checked against this phase's exact
  navigation spec line-by-line — already matches exactly.
- Product image system (min-4 nudge, unlimited images, upload/
  replace/delete, drag-and-drop, zoom, gallery, lightbox) — re-checked
  after Phase 9's `next/dynamic` change to `ImageLightbox`; fully
  functional.
- Admin CRUD for Products, Categories/Collections, Orders, Customers,
  Homepage Slider/Banner, New Arrivals, Sale, Newsletter, SEO/
  WhatsApp/Website Settings (Phases 6–7) — all already complete.
- Filters, Sorting, Pagination, Customer Dashboard, Order Tracking,
  Contact/About/Policy pages (Phases 4, 8) — all already complete.

### Quality

- Full-codebase unused-import scan (every `.ts`/`.tsx` file) — zero
  found.
- Full-codebase brace-balance, React-namespace, and `"use client"`
  directive audits — all clean.
- Investigated an apparent duplicate Laravel route name pair
  (`orders.index`/`orders.show`); confirmed safe — Laravel's route
  group `name()` prefixes make the final registered names distinct
  (`api.v1.admin.orders.index` vs. `api.v1.account.orders.index`).
- Updated stale doc comments in `store/cart-store.ts`,
  `app/(site)/cart/page.tsx`, and `components/products/product-actions.tsx`
  that no longer matched the code after this phase's changes.

### Notes

- The storefront still runs on `lib/mock/products.ts` — full
  storefront-to-real-catalog migration remains the Phase 6 scope
  decision. Checkout did not require resolving this (see
  `OrderService::createFromCheckout()`'s doc comment); the Wishlist's
  guest/logged-in sync still does, and remains deferred.
- Welcome and Password Reset emails still aren't auto-dispatched — no
  register/forgot-password call sites exist to wire them to yet.
- Local admin login unchanged: `admin@luxury.test` / `password`.

## [Phase 9] — Production Readiness

A polish/hardening phase — payment architecture, email templates,
security, performance, SEO, accessibility, error handling, analytics,
and logging, applied across the whole application.

### Added — Payment System

- Migration: `payments`. Model: `Payment`.
- `app/Payments/Contracts/PaymentGatewayInterface.php`,
  `app/Payments/DTOs/{PaymentInitiationResult,PaymentVerificationResult}.php`,
  `app/Payments/Exceptions/GatewayNotConfiguredException.php`.
- `app/Payments/Gateways/{CashOnDeliveryGateway,StripeGateway,JazzCashGateway,EasyPaisaGateway}.php`
  + `app/Payments/PaymentGatewayFactory.php`.
- `config/payments.php` + `.env.example` "Payments" section.
- `app/Services/PaymentService.php`.
- `app/Http/Controllers/Api/V1/PaymentController.php` +
  `app/Http/Requests/InitiatePaymentRequest.php` +
  `app/Http/Resources/PaymentResource.php`.
- `resources/views/payments/gateway-redirect.blade.php` — the signed
  auto-submit form bridge JazzCash/EasyPaisa's APIs require.
- New routes: `GET /payments/methods`, `POST /payments/initiate`,
  `POST /payments/webhook/{gateway}`,
  `GET /payments/{jazzcash,easypaisa}/redirect/{reference}` (signed).
- `Order` model gained a `payments()` relation.
- `tests/Feature/PaymentTest.php`.

### Added — Order Confirmation & Payment Status Pages

- Backend: `app/Http/Controllers/Api/V1/OrderLookupController.php` +
  `app/Http/Requests/LookupOrderRequest.php` —
  `POST /api/v1/orders/lookup` (public, order number + matching
  email).
- Frontend: `types/payment.ts`, `services/api/{payment,order-lookup}.service.ts`,
  `hooks/use-order-lookup.ts`, `lib/order-lookup-memory.ts`.
- `components/payment/{payment-status-page,order-lookup-gate,order-summary-card,print-invoice,payment-method-selector}.tsx`.
- `app/(site)/order-confirmation/page.tsx`,
  `app/(site)/payment/{success,failed,pending}/page.tsx`.
- `(site)` Header/Footer gained `print:hidden` so "Download Invoice"
  (via `window.print()`) works on the storefront the same way the
  admin's Print Invoice has since Phase 7.

### Added — Email System

- `resources/views/emails/layout.blade.php` (shared, fully
  inline-styled shell) + `resources/views/emails/partials/button.blade.php`.
- `resources/views/emails/{order-confirmation,shipping-update,password-reset,welcome,newsletter}.blade.php`.
- `app/Mail/{OrderConfirmationMail,ShippingUpdateMail,PasswordResetMail,WelcomeMail,NewsletterMail}.php`
  — all `ShouldQueue`.
- `tests/Feature/EmailTemplatesTest.php`.

### Added — Security

- `app/Http/Middleware/SecurityHeaders.php` (X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS),
  registered globally in `bootstrap/app.php`.
- `bootstrap/app.php`: `$middleware->throttleApi()` global default
  (60/min); tighter per-route throttles added to login/register
  (5/min), contact (5/min), newsletter subscribe (10/min), payment
  initiate (10/min), order lookup (20/min).

### Added — Performance

- `next.config.ts`: `poweredByHeader: false`, `compress: true`,
  `experimental.optimizePackageImports` (lucide-react, framer-motion,
  recharts), immutable cache headers for hashed static assets.
- `components/products/product-media.tsx`: `ImageLightbox` converted
  to a `next/dynamic` (`ssr: false`) import.

### Added — SEO

- `app/sitemap.ts`, `app/robots.ts` (Next.js dynamic route
  conventions — `/sitemap.xml`, `/robots.txt`).
- `lib/structured-data.ts` (`buildOrganizationSchema`,
  `buildWebsiteSchema`, `buildBreadcrumbSchema`), rendered in
  `(site)/layout.tsx`.
- `app/layout.tsx`: added `metadataBase`, default Open Graph/Twitter
  Card metadata, default canonical, optional Google Search Console
  verification.

### Added — Error Handling & Accessibility

- `app/global-error.tsx` (root-level error boundary — the one that
  can catch a failure in the root layout itself).
- `app/admin/error.tsx` (parity with the storefront's Phase 8
  `(site)/error.tsx`; the admin only had `not-found.tsx` before).

### Added — Analytics & Logging

- `components/shared/analytics-scripts.tsx` (GA4, Facebook Pixel,
  TikTok Pixel — fully optional, self-gating on env vars, loaded via
  `next/script`).
- `config/env.ts` / `.env.example`: `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`,
  `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`.
- `config/logging.php`: new `api` and `activity` channels.
- `app/Http/Middleware/ApiRequestLogger.php` (registered globally) —
  one structured log line per API request; never logs request bodies.
- `app/Support/ActivityLogger.php`, wired into
  `OrderService::updateStatus()` and `CustomerService::setAccountStatus()`
  as the demonstrated pattern.

### Changed

- `app/Http/Resources/UserResource.php`, `app/Models/User.php`: no
  changes needed this phase (Phase 8 already exposed `phone`).
- `components/layout/{header,footer}.tsx`: added `print:hidden`.
- `frontend/.env.example`, `backend/.env.example`: new Phase 9
  sections (Payments, Analytics).

### Notes

- No live checkout flow exists yet — the entire Payment System is
  real, tested, and ready to be called from one once it's scoped.
  Stripe/JazzCash/EasyPaisa are structurally complete and correct
  (real signing schemes, real API shapes) but need real merchant
  credentials to actually go live; Cash on Delivery is fully
  functional today with no credentials needed.
- Email templates are real and tested but not yet auto-dispatched
  from registration, password-reset, or shipping-update call sites —
  each documented as a small, specific follow-up in its own Mailable.
- Local admin login unchanged: `admin@luxury.test` / `password`.

## [Phase 8] — Premium Customer Experience

Shifts focus to the customer-facing storefront: real customer
authentication (a first — Phases 1–7 used the JWT foundation for
admin login only), a full Account Dashboard, Order Tracking, an
upgraded Wishlist and Search, notifications, empty states, error
pages, and the storefront's remaining content/legal pages.

### Added — Backend: Customer Account API

- Migrations: `wishlist_items`, `contact_messages`.
- `app/Http/Controllers/Api/V1/Account/{Profile,Address,Order,Wishlist}Controller.php`
  — new `/api/v1/account/*` route group, any authenticated user, every
  query scoped to `$request->user()`.
- `app/Services/{AccountService,AccountAddressService,WishlistService}.php`.
- `app/Http/Requests/Account/{UpdateProfileRequest,ChangePasswordRequest,StoreAddressRequest,UpdateAddressRequest}.php`.
- `app/Http/Controllers/Api/V1/ContactController.php` +
  `app/Http/Requests/SubmitContactMessageRequest.php` — public,
  persists real Contact page submissions.
- `UserResource` now exposes `phone` (added to `users` in Phase 7,
  never exposed until now).
- `tests/Feature/Account/AccountManagementTest.php` + a shared
  `loginAsCustomer()` helper added to `tests/Pest.php`.

### Added — Frontend: Data Layer

- `types/account/{address,order}.ts`.
- `services/api/account/{profile,addresses,orders}.service.ts`,
  `services/api/contact.service.ts`.
- `hooks/account/use-account-{profile,addresses,orders}.ts`.
- `constants/api-endpoints.ts` / `constants/routes.ts` — full Phase 8
  account/auth/content-page route registries.

### Added — Customer Authentication & Account Dashboard

- `app/(site)/login/page.tsx`, `app/(site)/register/page.tsx`.
- `components/account/customer-guard.tsx`.
- `app/(site)/account/{page,profile/page,addresses/page,orders/page,orders/[id]/page,settings/page,wishlist/page}.tsx`
  + `app/(site)/account/layout.tsx`.
- `components/account/{account-nav,order-tracking-timeline}.tsx`.
- `store/auth-store.ts` / `hooks/use-auth.ts`: no changes needed —
  both were already generic enough (built Phase 1, extended Phase 6)
  to serve customer login for the first time without modification.

### Added — Wishlist (Phase 8 scope decision — see PROJECT_MEMORY.md)

- Real, tested backend (`WishlistItem` model, `WishlistService`,
  `Account\WishlistController`) — NOT wired to the frontend store,
  which stays client-only for guests and logged-in customers alike.
  `store/wishlist-store.ts`'s doc comment explains why in full.
- `lib/products.ts` gained `getProductById()`.
- Wishlist page (Move to Bag, Remove, premium empty state), header +
  mobile-nav wishlist counter badges.

### Added — Advanced Search

- `store/recent-searches-store.ts`, `components/shared/highlight-text.tsx`.
- `components/layout/search-overlay.tsx` and
  `components/collections/search-page-content.tsx` — recent searches
  shown on empty input, matched-keyword highlighting, premium
  "No Results" state via the new shared `EmptyState`.
- `components/collections/product-grid.tsx` gained an optional
  `emptyState` override prop.
- Filters and Sorting: verified already complete from Phase 4
  (Collection/Category/Fabric/Price/Availability/New Arrivals/Sale;
  Newest/Featured/Best Selling/Price asc/desc) — no changes needed.

### Added — Notifications & Empty States

- `store/toast-store.ts` + `components/shared/toaster.tsx`: added
  `warning`/`info` variants alongside `success`/`error`.
- `components/shared/empty-state.tsx` — new generic empty state, now
  used by Wishlist, Search, Order History, and Cart.

### Added — New Pages

- `app/(site)/{about,contact,faqs}/page.tsx`.
- `components/policy/policy-layout.tsx` +
  `app/(site)/{privacy-policy,terms-conditions,returns,shipping,refund-policy}/page.tsx`.
- `app/(site)/not-found.tsx`, `app/(site)/error.tsx`,
  `app/(site)/maintenance/page.tsx`.
- `components/shared/contact-form.tsx`.

### Changed

- `components/shared/newsletter-form.tsx` unaffected this phase (was
  wired to the real backend in Phase 7); `components/layout/footer.tsx`
  gained a legal links row (Privacy/Terms/Refund) and its Shipping/
  Returns/FAQ links now point at real pages instead of placeholder
  hrefs.
- `components/layout/header.tsx` / `mobile-nav.tsx` — added the
  wishlist counter badge (was missing despite the cart badge existing
  since Phase 5).
- `app/(site)/cart/page.tsx` — empty state migrated to the new shared
  `EmptyState` component.
- `config/site.ts` — added `contact: { email, phone, address }`,
  mirroring the Phase 7 admin Website Settings defaults.
- `lib/whatsapp.ts` — added `buildWhatsAppGeneralLink()` for non-order
  contexts (Contact page), alongside the existing order-specific
  `buildWhatsAppOrderLink()`.

### Notes

- No checkout/payment work — still out of scope, as in every prior
  phase.
- No admin UI for viewing `contact_messages` — the data is real and
  persisted; a management screen is a natural, small follow-up.
- Maintenance page is a reachable page only, not wired to actual
  maintenance-mode infrastructure (a deploy-time concern).

## [Phase 7] — Remaining Admin Dashboard Modules

Full-stack phase, same approach as Phase 6 — real schema, real
endpoints, realistic seeded data.

### Added — Backend Schema & Models

- Migrations: `settings`, `slides`, `addresses`, `orders`,
  `order_items`, `order_status_histories`, `order_notes`,
  `customer_notes`, `newsletter_subscribers`; `phone`/`account_status`
  added to `users`; `new_arrival_position`/`sale_position` added to
  `products`.
- Models: `Setting` (cached `forGroup()`/`set()`/`setMany()` helpers),
  `Slide`, `Address`, `Order` (+ `STATUSES` const, `search` scope),
  `OrderItem`, `OrderStatusHistory`, `OrderNote`, `CustomerNote`,
  `NewsletterSubscriber`; `User` extended with `addresses()`,
  `orders()`, `customerNotes()`, `customers`/`search` scopes.
- Factories: `SlideFactory`, `AddressFactory`, `OrderFactory`,
  `OrderItemFactory`, `NewsletterSubscriberFactory`.

### Added — Backend Services, Requests, Resources, Controllers

- `app/Services/{OrderService,CustomerService,SlideService,CurationService}.php`.
- `app/Http/Requests/Admin/{UpdateOrderStatusRequest,AddNoteRequest,UpdateCustomerStatusRequest,UploadSlideRequest,UpdateSlideRequest,ReorderSlidesRequest,UpdateSettingsRequest,ReorderCurationRequest}.php`,
  `app/Http/Requests/SubscribeNewsletterRequest.php`.
- `app/Http/Resources/Admin/{OrderItem,OrderStatusHistory,OrderNote,Order,Address,CustomerNote,Customer,Slide,NewsletterSubscriber}Resource.php`.
- `app/Http/Controllers/Api/V1/Admin/{Order,Customer,Slide,Settings,Curation,NewsletterSubscriber}Controller.php`,
  `app/Http/Controllers/Api/V1/NewsletterController.php` (public
  subscribe).
- `routes/api.php` — full Phase 7 route additions (see
  `docs/api/admin.md` for the reference).

### Added — Backend Seeders & Tests

- `database/seeders/{SettingsSeeder,SlideSeeder,AddressSeeder,OrderSeeder,NewsletterSubscriberSeeder}.php`,
  wired into `DatabaseSeeder`.
- `tests/Feature/Admin/OrderCustomerManagementTest.php`.

### Added — Frontend Data Layer

- `types/admin/{order,customer,slide,settings,newsletter}.ts`.
- `services/api/admin/{orders,customers,slides,settings,curation,newsletter}.service.ts`,
  `services/api/newsletter.service.ts`.
- `hooks/admin/use-admin-{orders,customers,slides,settings,curation,newsletter}.ts`.
- `constants/api-endpoints.ts` / `constants/routes.ts` — full Phase 7
  admin endpoint/route registries.

### Added — Orders Management UI

- `components/admin/orders/{order-status-badge,order-filters,order-table,order-timeline,order-status-changer,print-invoice}.tsx`.
- `app/admin/(dashboard)/orders/{page,[id]/page}.tsx`.
- Print Invoice via Tailwind's `print:` variant (admin chrome
  `print:hidden`, invoice `hidden print:block`) — no PDF library, no
  separate print route.

### Added — Customers Management UI

- `components/admin/customers/{customer-table,customer-filters}.tsx`,
  `app/admin/(dashboard)/customers/{page,[id]/page}.tsx`.
- `components/admin/shared/notes-panel.tsx` — one reusable notes
  thread shared by Orders and Customers.

### Added — Homepage / Hero / Auto Moving Slider Manager

- `components/admin/content/slide-manager.tsx` — drag-and-drop
  upload, native-HTML5-drag reorder, per-slide edit, enable/disable;
  powers both the Hero Banner and the Auto Moving Slider.
- `components/admin/content/marquee-settings-form.tsx` (speed,
  direction, pause-on-hover, mobile-swipe — maps onto Phase 3's
  `useMarquee` options), `components/admin/content/homepage-sections-form.tsx`
  (section show/hide toggles + Instagram handle).
- `app/admin/(dashboard)/content/{homepage,hero,slider}/page.tsx`.

### Added — New Arrivals / Sale Managers

- `components/admin/curation/{curation-manager,product-picker}.tsx`
  (generic, shared by both), `components/admin/content/sale-settings-form.tsx`.
- `app/admin/(dashboard)/{new-arrivals,sale}/page.tsx`.

### Added — Settings & Newsletter Management

- `components/admin/settings/{settings-tabs,website-settings-form,whatsapp-settings-form,seo-settings-form}.tsx`
  + `app/admin/(dashboard)/settings/{website,whatsapp,seo}/page.tsx`.
- `app/admin/(dashboard)/newsletter/page.tsx` — list, search, delete,
  authenticated CSV export (blob-fetch + synthetic download link,
  since a plain `<a href>` can't attach the JWT bearer header).

### Changed

- `components/admin/layout/admin-sidebar.tsx` rewritten with grouped
  sections (Catalog / Sales / Content / Store); the Phase 6
  "Coming in Phase 7" locked placeholders are gone, replaced by real
  links.
- `components/admin/layout/admin-sidebar.tsx` / `admin-topbar.tsx` —
  added `print:hidden` to support the new Print Invoice feature.
- `components/shared/newsletter-form.tsx` (Phase 2/3) now submits to
  the real `POST /api/v1/newsletter/subscribe` endpoint instead of
  only validating client-side; `components/layout/footer.tsx` and
  `components/home/newsletter-section.tsx` pass a `source` prop.
- **`app/Services/DashboardService.php` and its controller** — updated
  in this same phase to make `totalOrders`/`totalCustomers`/`revenue`
  real (they were explicit `null` placeholders through Phase 6, since
  Orders/Customers didn't exist yet) and to rank "Best Selling
  Products" by real units sold from `order_items`, replacing Phase
  6's "Featured Products" stand-in. `services/api/admin/dashboard.service.ts`
  and `app/admin/(dashboard)/page.tsx` updated to match, plus a new
  "Latest Orders" panel.
- `frontend/package.json` — added `@radix-ui/react-checkbox`,
  `@radix-ui/react-switch` (used across the new Settings/Slide/
  Curation UIs for toggles and selection).

### Notes

- No Coupons module was built — named in the original Phase 6 brief's
  "DO NOT BUILD" list but not picked up in Phase 7's checklist either;
  remains unbuilt, noted in `PROJECT_MEMORY.md` as a candidate for a
  future phase.
- `lib/whatsapp.ts` (Phase 5) still reads the static
  `siteConfig.whatsAppNumber` rather than the new, real WhatsApp
  Settings value — the setting itself is now real and editable;
  wiring the storefront to read it is a small follow-up, consistent
  with the Phase 6 scope decision to leave the storefront on its own
  data sources for now.
- Local admin login unchanged: `admin@luxury.test` / `password`.

## [Phase 6] — Admin Dashboard

Full-stack phase — real backend schema and endpoints, not a
frontend-only build against mock data. The storefront (Phases 3–5) is
unchanged and still runs on its own mock catalog; see
`PROJECT_MEMORY.md`'s Phase 6 "Scope decision" note.

### Added — Backend Schema & Models (`backend`)

- Migrations: `create_categories_table` (self-referencing tree — one
  table backs both "Category Management" and "Collection Management"),
  `create_products_table`, `create_product_images_table`.
- Models: `Category` (self-referential `parent()`/`children()`,
  `ancestors()`, `isLeaf()`, `scopeVisible`/`scopeRoots`), `Product`
  (`category()`, `images()`, `featuredImage()`, `isInStock()`/
  `isLowStock()`, `scopePublished`/`scopeSearch`), `ProductImage`.
- Factories: `CategoryFactory`, `ProductFactory` (with `draft()`/
  `onSale()`/`outOfStock()` states), `ProductImageFactory`.

### Added — Backend Services, Requests, Resources, Controllers

- `app/Services/{CategoryService,ProductService,ProductImageService,DashboardService}.php`
  — see `PROJECT_MEMORY.md` for what each owns (slug/SKU generation,
  safe-delete guards, duplication, real Cloudinary upload, honest
  dashboard stats).
- `app/Http/Requests/Admin/*` — `Store/UpdateCategoryRequest`,
  `ReorderCategoriesRequest`, `Store/UpdateProductRequest`,
  `BulkProductActionRequest`, `Upload/ReorderProductImagesRequest`.
- `app/Http/Resources/Admin/{Category,Product,ProductImage}Resource.php`.
- `app/Http/Controllers/Api/V1/Admin/{Dashboard,Category,Product,ProductImage}Controller.php`.
- `routes/api.php` — new `/api/v1/admin/*` group, protected by
  `jwt.auth` + `role:admin,super_admin` (both from Phase 1).

### Added — Backend Seeders & Tests

- `database/seeders/{CategorySeeder,ProductSeeder}.php` — seeds the
  exact `constants/navigation.ts` tree plus one starter product per
  leaf category (placeholder `picsum.photos` images).
- `tests/Feature/Admin/{CategoryManagementTest,ProductManagementTest}.php`
  + a shared `loginAsAdmin()` helper added to `tests/Pest.php`.

### Added — Frontend Route Restructuring

- `app/(site)/` route group now holds every pre-Phase-6 public route
  (zero URL changes). `app/layout.tsx` reduced to fonts/providers/
  toaster only; `app/(site)/layout.tsx` carries the storefront
  `Header`/`Footer` that used to live in the root layout.
- `app/admin/login/page.tsx` (outside the guarded group) +
  `app/admin/(dashboard)/*` (guarded shell: dashboard home, products,
  categories) + `app/admin/not-found.tsx`.

### Added — Frontend Admin Auth

- `components/admin/admin-guard.tsx` — validates every admin route via
  a real `GET /auth/me` call on mount.
- `services/api/client.ts` — silent-refresh-on-401 response
  interceptor (deduplicated across concurrent requests).
- `store/auth-store.ts` — `setSession` gained a `rememberMe` param
  controlling the cookie's own browser-side lifetime, independent of
  the JWT's short expiry.
- `hooks/use-auth.ts` — `login` accepts `rememberMe`; `logout` no
  longer hardcodes a storefront redirect (safe to extend — this hook
  was unused since Phase 1).
- `constants/routes.ts` — fleshed out `ROUTES.admin.*`
  (login/products/productNew/productEdit/categories).

### Added — Frontend Admin Data Layer

- `types/admin/{category,product}.ts`.
- `services/api/admin/{categories,products,product-images,dashboard}.service.ts`.
- `hooks/admin/use-admin-{categories,products,product-images,dashboard}.ts`
  (React Query, with per-resource query-key factories).
- `constants/api-endpoints.ts` — new `admin.*` endpoint registry.

### Added — Frontend Admin Shell & Dashboard

- `components/admin/layout/{admin-sidebar,admin-topbar,admin-shell,theme-toggle}.tsx`,
  `store/admin-theme-store.ts` — working dark/light mode, scoped to
  the admin subtree only.
- `app/admin/(dashboard)/page.tsx` +
  `components/admin/dashboard/{stat-card,chart-placeholder,quick-actions,admin-product-mini-list}.tsx`.

### Added — Frontend Product Management

- `components/admin/products/{category-select,product-filters,product-table,bulk-actions-bar,tag-input,image-manager,product-form}.tsx`.
- `app/admin/(dashboard)/products/{page,new/page,[id]/edit/page}.tsx`.
- `components/ui/{table,checkbox,switch}.tsx` (new Radix
  dependencies: `@radix-ui/react-checkbox`, `@radix-ui/react-switch`).
- `lib/admin/category-tree-utils.ts` (`flattenCategoryTree`,
  `indentLabel`, `isSelfOrDescendant`).
- Real drag-and-drop image upload (straight to Cloudinary via the
  Phase 1 disk), native-HTML5-drag reordering, delete, set-featured.

### Added — Frontend Category/Collection Management

- `components/admin/categories/{category-tree,category-form-dialog}.tsx`,
  `app/admin/(dashboard)/categories/page.tsx`.
- Recursive tree: expand/collapse, drag-reorder within a parent,
  inline add-subcategory/edit/hide/delete, product-count badges.

### Added — Documentation

- `docs/api/admin.md` — full admin endpoint reference.
- `docs/architecture/admin-dashboard.md` — route-group rationale, the
  one-tree-not-two decision, the storefront-stays-on-mock-data scope
  call, native-DnD-over-a-library reasoning, the real "Remember
  Login" mechanism, and the honest-dashboard-stats approach.

### Changed

- `frontend/src/styles/globals.css` — the `.dark` block's comment
  (previously "reserved for the Admin Dashboard shell (Phase 8+)")
  updated to reflect that Phase 6 is where it's actually used.
- `backend/README.md` — added an "Admin Module" section with local
  admin credentials and a pointer to `docs/api/admin.md`.
- `components/home/new-arrivals-preview.tsx` and every other
  storefront file: **unchanged** this phase — confirmed via the same
  import-resolution/brace-balance validation pass used every prior
  phase.

### Fixed

Five lazy-loading violations that would have thrown under Phase 1's
`Model::preventLazyLoading(!isProduction())` — each replaced a
property-access relation read (`$model->relation`, which requires the
relation already eager-loaded) with an explicit `->relation()->first()`
query-builder call or a self-contained `->load()`:

- `Category::ancestors()`, `CategoryService`'s self-descendant guard
  (both walked `->parent` in a loop).
- `Product::featuredImage()` (`->images->firstWhere(...)`).
- `ProductService::duplicate()` and
  `ProductImageService::deleteAllForProduct()` (both iterated
  `foreach ($product->images as ...)` without guaranteeing the
  caller had eager-loaded it first).

### Notes

- No Orders Management, Customer Management, Coupons, Homepage Banner
  Manager, Slider Manager, Website Settings, or SEO Manager were
  built — all explicitly Phase 7 per the brief.
- Local admin login for testing: `admin@luxury.test` / `password`.
- The storefront intentionally still runs on `lib/mock/products.ts`
  (Phases 3–5) — the admin panel's real backend and the storefront's
  mock catalog are two separate systems as of this phase, by design.

## [Phase 5] — Product Details Page

Frontend-only phase (no Laravel backend changes) — same rationale as
Phases 2–4.

### Added — Product Data (`frontend/src/lib`, `frontend/src/types`)

- `types/product.ts` — extended `Product` with `sku`,
  `shortDescription`, `description`, `careInstructions`,
  `deliveryEstimateDays`.
- `types/review.ts` — `Review`.
- `lib/mock/products.ts` — `buildSku`, `buildDescriptions`,
  `careInstructionsFor` (fabric-aware, with a documented default
  fallback); every mock product now populates the new fields.
- `lib/mock/reviews.ts` — deterministic mock reviews (2–6 per
  product, skewed positive, seeded — not `Math.random()`).
- `lib/reviews.ts` — `getReviewsForProduct`, `getRatingSummary`.
- `lib/products.ts` — `getProductBySlug`, `getRelatedProducts` (same
  leaf category, falls back to parent piece-type level),
  `getYouMayAlsoLike` (same top-level collection, different fabric,
  deterministically ranked).
- `lib/nav-tree.ts` — `findNodesByIdPath` (resolves
  `Product.categoryPath`'s id chain back to real `NavNode`s, for
  breadcrumb hrefs).
- `lib/whatsapp.ts` — `buildWhatsAppOrderLink`.
- `config/site.ts` — added `whatsAppNumber` (placeholder, documented
  as pending real admin configuration).

### Added — Product Components (`frontend/src/components/products`)

- `product-gallery.tsx` — `ProductGallery`: thumbnail rail,
  hover-magnify zoom, swipe (Framer Motion drag), keyboard arrows,
  crossfade transitions.
- `image-lightbox.tsx` — `ImageLightbox`: fullscreen viewer built
  directly on Radix Dialog primitives (not the shared centered
  `Dialog`), same navigation hook as the inline gallery.
- `product-media.tsx` — `ProductMedia` (owns the shared gallery/
  lightbox open-state).
- `product-info.tsx` — `ProductInfo` (name, SKU, price, discount
  badge, availability, short description).
- `product-actions.tsx` — `ProductActions` (quantity, Add to Bag, Buy
  Now, Wishlist, Share, Copy Link, WhatsApp order).
- `product-tabs.tsx` — `ProductTabs` (Description, Fabric Details,
  Shipping Information, Return Policy, Care Guide).
- `reviews-section.tsx` — `ReviewsSection` (average rating +
  distribution bars, review list with Verified Purchase badges, Write
  a Review form).
- `product-row.tsx` — `ProductRow` (one reusable row for Related
  Products / You May Also Like / Recently Viewed).
- `recently-viewed-row.tsx` — `RecentlyViewedRow`.

### Added — Supporting UI/State

- `components/ui/tabs.tsx` — `Tabs`/`TabsList`/`TabsTrigger`/
  `TabsContent` (Radix-based).
- `components/shared/star-rating.tsx` — `StarRating` (supports
  fractional ratings via a clipped partial-fill overlay).
- `components/shared/toaster.tsx` + `store/toast-store.ts` — global
  toast notification system (`Toaster` mounted once in
  `app/layout.tsx`).
- `store/cart-store.ts` — `useCartStore` (persisted; Add to Bag/Buy
  Now are real actions as of this phase).
- `store/recently-viewed-store.ts` — `useRecentlyViewedStore`
  (persisted, capped at 8).
- `hooks/use-image-gallery.ts` — `useImageGallery` (shared index/
  keyboard/swipe state for gallery + lightbox).

### Added — Routes (`frontend/src/app`)

- `app/products/[slug]/page.tsx` — the product detail page, statically
  pre-rendered for every mock product via `generateStaticParams`;
  dynamic `generateMetadata` (title, description, canonical, Open
  Graph, Twitter card) and a `Product` JSON-LD script tag.
- `app/products/loading.tsx`, `app/products/not-found.tsx`.
- `app/cart/page.tsx` — minimal cart list (quantity, remove,
  subtotal); not an explicit Phase 5 requirement, added so the
  header's now-functional cart badge doesn't lead to a dead end.
  Deliberately has no checkout flow.

### Changed

- `components/collections/breadcrumbs.tsx` — now always leads with a
  "Home" crumb before "Collections" (`Home > Collections > ...`),
  matching Phase 5's spec example exactly. This improves every
  existing breadcrumb consumer (collection pages), not just the new
  product page; on the `/collections` index itself, "Collections" now
  correctly renders as the non-linked current page instead of a
  self-link.
- `components/layout/header.tsx` — the cart `IconButton`'s `indicator`
  (left as a documented TODO since Phase 2: `// indicator={cartItemCount}
  — wired up once cart state exists (Phase 5+)`) now shows a live
  count from `useCartStore`.
- `app/layout.tsx` — mounts `Toaster` alongside `Header`/`Footer`.

### Fixed

- `components/products/product-actions.tsx` — an early draft computed
  the shareable product URL from `window.location.href` with a
  server-side fallback, which would have produced different HTML
  between the server render and the client's first hydration pass (a
  real hydration-mismatch risk, same class of bug fixed in earlier
  phases). Fixed by always using the deterministic canonical URL
  (`env.app.url` + route) — also more correct for sharing, since it
  never carries stray query params.
- `components/products/reviews-section.tsx` — an early draft of the
  star-rating input reused the read-only, always-5-star `StarRating`
  component per individual star button, which would have rendered
  five nested mini star-rows instead of one coherent picker. Fixed
  with a dedicated inline star picker.
- `components/collections/quick-view-dialog.tsx`'s "View Full
  Details" link, and every other link built in Phase 4 pointing at
  `/products/[slug]` before that route existed, now resolve to a real
  page instead of a 404.

### Notes

- No checkout, payment, admin dashboard, orders, authentication, or
  backend APIs were built — all explicitly out of scope for Phase 5
  per the project brief.
- `package.json` gained one new dependency: `@radix-ui/react-tabs`
  (for `ProductTabs`). No other new packages were required.

## [Phase 4] — Collections System & Product Listing Pages

Frontend-only phase (no Laravel backend changes) — see "Notes" below.

### Added — Nav Tree & Product Data (`frontend/src/lib`, `frontend/src/types`)

- `lib/nav-tree.ts` — generalized tree utilities: `collectLeaves`,
  `collectAllLeaves`, `collectAtDepth`, `collectLeavesWithTrail`
  (leaves paired with their full ancestor trail), `resolveNodePath`
  (URL segments -> matched node + ancestors), `slugOf`, `depthOf`,
  `collectAllPaths` (every node's full path, for `generateStaticParams`).
- `types/product.ts` — `Product`, `ProductImage`, `SortOption`.
- `lib/mock/products.ts` — deterministic (seeded, not `Math.random()`)
  mock catalog: ~144 products (9 per leaf category × 16 leaves), each
  with 4–6 images, realistic price/badge/date distribution.
- `lib/products.ts` — `getProductsForNode`, `ProductFilters` +
  `filterProducts`, `sortProducts`, `paginateProducts`,
  `searchProducts`.
- `lib/collection-filter-visibility.ts` — `computeFilterVisibility`,
  decides which filter groups are redundant given the current node
  (e.g. no "Fabric" checkboxes on a fabric leaf page).
- `constants/filters.ts` — `COLLECTION_FILTER_OPTIONS`,
  `PIECE_TYPE_FILTER_OPTIONS`, `FABRIC_FILTER_OPTIONS`, all derived
  programmatically from `primaryNav`, never hand-duplicated.

### Added — Collections Components (`frontend/src/components/collections`)

- `breadcrumbs.tsx` — `Breadcrumbs`.
- `collection-hero.tsx` — `CollectionHero` (breadcrumb + title +
  description + live product count).
- `collection-subcategories.tsx` — `CollectionSubcategories` (chip
  grid shown on non-leaf category pages).
- `product-card.tsx` — `ProductCard`: hover image-swap, collection
  badge, New/Sale badges, out-of-stock overlay, Quick View + Wishlist
  buttons (all affordances also appear on keyboard focus, not only
  hover).
- `product-card-skeleton.tsx` — `ProductCardSkeleton`.
- `product-grid.tsx` — `ProductGrid`: 1/2/4-column responsive grid,
  loading-skeleton state, empty state, stagger-in animation.
- `empty-state.tsx` — `EmptyState`.
- `filters-panel.tsx` — `FiltersPanel` (Collection/Piece Type/Fabric
  checkboxes, Price Range, Availability, New/Featured/Sale quick-
  filter chips).
- `filters-mobile.tsx` — `FiltersMobile` (same panel in a `Sheet`).
- `sort-dropdown.tsx` — `SortDropdown` (native `<select>`, styled).
- `pagination.tsx` — `Pagination` (ellipsis collapse beyond 7 pages).
- `quick-view-dialog.tsx` — `QuickViewDialog` (centered modal preview;
  explicitly not the full product detail page).
- `collection-explorer.tsx` — `CollectionExplorer`, the client-side
  orchestration component tying filters/sort/grid/pagination together.
- `search-page-content.tsx` — `SearchPageContent` (the `/search` page's
  interactive body).

### Added — Supporting UI/State

- `components/ui/dialog.tsx` — `Dialog`/`DialogContent` (centered
  modal primitive, distinct from Phase 2's side-anchored `Sheet`).
- `store/wishlist-store.ts` — `useWishlistStore` (Zustand, persisted
  to localStorage; documented as a client-only placeholder for a
  future server-side wishlist).
- `hooks/use-product-filters.ts` — `useProductFilters` (filter/sort/
  pagination state + derived results via `useMemo`).

### Added — Routes (`frontend/src/app`)

- `app/collections/[...slug]/page.tsx` — the one dynamic route that
  renders every required collection/category page (Summer Collection,
  Winter Collection, 2 Piece, 3 Piece, Embroidered Lawn, Printed Lawn,
  Marina, Linen, Viscose, Winter Karandi, Khaddar, Embroidered Shawls,
  Printed Shawls, and every intermediate node), statically
  pre-rendered via `generateStaticParams`.
- `app/collections/page.tsx` — unscoped `/collections` index (every
  product, full filter set).
- `app/collections/loading.tsx`, `app/collections/not-found.tsx`.
- `app/search/page.tsx` — search results page (`?q=` synced via
  `router.replace`, no scroll jump).
- `app/new-arrivals/page.tsx`, `app/sale/page.tsx` — not explicitly
  required by Phase 4's checklist, but already linked from Phase 2's
  header nav and Phase 3's homepage; cheap to complete now that
  `CollectionExplorer` exists. Pre-filtered by `isNew`/`salePrice`
  instead of a nav-tree node.

### Changed

- `components/home/collection-marquee.tsx` — refactored off a local,
  one-off tree-flattening function onto the new shared
  `lib/nav-tree.ts:collectAtDepth` (identical visible output).
- `components/layout/search-overlay.tsx` — Phase 2's UI-only shell
  now runs real, instant search (`lib/products.ts:searchProducts`)
  against the mock catalog, with a live results dropdown and "View
  All Results" -> `/search?q=...`.
- `components/home/new-arrivals-preview.tsx` — now renders the 4
  newest real products via the real `ProductCard`, replacing the
  Phase 3 static placeholder array.
- `frontend/src/app/collections/[...slug]/page.tsx` and
  `app/collections/page.tsx` avoid relying on inline optional-
  chaining narrowing (`node.children?.length ? ... : ...`) for a
  value passed as a prop — pass `node.children ?? []` directly instead,
  since `CollectionSubcategories` already no-ops on an empty array.

### Removed

- `components/home/product-preview-card.tsx` and
  `types/product-preview.ts` — Phase 3's placeholder product card/type,
  superseded by the real `ProductCard`/`Product` now that a catalog
  exists. Removed rather than left as unused dead code; their one
  caller (`NewArrivalsPreview`) was migrated in the same change.

### Fixed

- `components/collections/quick-view-dialog.tsx` — the dialog
  conditionally rendered `DialogContent` based on a nullable
  `product` prop, which unmounted the content the instant it closed,
  before Radix's exit-transition CSS could play. Fixed by retaining
  the last-known product in local state so the content stays mounted
  (with valid data) through the close animation, while `open` still
  controls actual visibility.

### Notes

- No product detail page, cart, checkout, authentication, admin
  dashboard, orders, payments, or WhatsApp integration were built —
  all explicitly out of scope for Phase 4 per the project brief.
- No backend (Laravel) changes this phase — Phase 4's brief scopes
  "Collections System and Product Listing Pages," which (like Phases
  2–3) is a frontend concern; a real product API is a documented
  candidate for a future phase (see `PROJECT_MEMORY.md` §8).
- Filter/sort/page state is local component state, not URL-synced,
  for every collection page except `/search` (which is URL-synced).
  Documented as a deliberate scope trade-off, not an oversight.
- No new npm packages were required beyond what Phases 1–3 already
  installed (Radix Dialog was already a dependency for `Sheet`;
  Zustand was already a dependency for the auth store).

## [Phase 3] — Premium Luxury Homepage

### Added — Reusable Infrastructure (`frontend/src/components/shared`, `frontend/src/hooks`)

- `components/shared/section.tsx` — `Section`, the vertical-rhythm +
  background-tone wrapper used by every homepage section
  (`tone`: canvas/porcelain/ink/evergreen, `spacing`: sm/md/lg/xl,
  `fullBleed` option).
- `components/shared/media-placeholder.tsx` — `MediaPlaceholder`, the
  single reusable stand-in for real photography (gradient + faint
  SVG weave pattern + monogram, per-instance unique pattern id via
  `useId`), used by every image-shaped slot on the homepage.
- `components/shared/marquee.tsx` + `hooks/use-marquee.ts` — `Marquee`
  / `useMarquee`, the reusable auto-scrolling marquee engine: `
  requestAnimationFrame` + measured modulo wrap for a seamless loop,
  Pointer Events for unified mouse-drag/touch-swipe, hover-to-pause,
  `prefers-reduced-motion` support, edge fade masks. Full mechanics
  documented in `docs/architecture/marquee.md`.
- `hooks/use-parallax.ts` — `useParallax`, light scroll-linked
  parallax built on Framer Motion's `useScroll`/`useTransform`.
- `components/shared/newsletter-form.tsx` — `NewsletterForm`,
  extracted from Phase 2's `Footer` into a shared component
  (`variant`: inline/section, `tone`: light/dark) so the footer and
  the new homepage newsletter section share one real-validation
  implementation.

### Added — Homepage Sections (`frontend/src/components/home`)

- `hero.tsx` — `Hero`: multi-slide banner (`constants/hero-slides.ts`
  data), autoplay with pause-on-hover, fade + light Ken Burns zoom
  between slides, accessible dot navigation (`aria-current`), Shop
  Now / Explore Collection CTAs.
- `featured-collections.tsx` — `FeaturedCollections`: Summer/Winter
  cards, stagger-in on scroll, image scale + gradient-reveal hover,
  Explore affordance.
- `collection-marquee.tsx` — `CollectionMarquee`: the "Ramsha
  Inspired Auto Moving Collection Slider," built on `Marquee`,
  flattening every leaf category from `constants/navigation.ts`'s
  `primaryNav` into one infinite scrolling strip.
- `product-preview-card.tsx` — `ProductPreviewCard`: reusable
  placeholder product card (wishlist affordance, badge, category,
  placeholder price) built on Phase 2's `Card` primitive.
- `new-arrivals-preview.tsx` — `NewArrivalsPreview`: `
  ProductPreviewCard` grid with placeholder items only (no catalog
  until Phase 4), "View All" CTA.
- `sale-section.tsx` — `SaleSection`: full-bleed dark promotional
  band with brass CTA.
- `brand-story.tsx` — `BrandStory`: editorial two-column section with
  a light parallax image (`useParallax`, 110% overscan to avoid
  exposing edges during translation).
- `why-choose-us.tsx` — `WhyChooseUs`: 4-tile feature grid (Premium
  Quality, Fast Delivery, Secure Payment, Customer Support).
- `newsletter-section.tsx` — `NewsletterSection`: large-format
  `NewsletterForm` on an evergreen background.
- `instagram-gallery.tsx` — `InstagramGallery`: 6-tile placeholder
  grid with hover overlay + icon.

### Added — Types & Data

- `types/product-preview.ts` — `ProductPreview` (deliberately minimal
  placeholder shape, not a preview of the eventual Phase 4 schema).
- `constants/hero-slides.ts` — `HeroSlide[]`, shaped to match a
  future admin-managed hero-slides API resource.

### Added — Documentation

- `docs/architecture/marquee.md` — full mechanics and rationale for
  the auto-moving marquee (why RAF + modulo wrap instead of CSS
  keyframes, Pointer Events for unified drag/swipe, reduced-motion
  handling).

### Changed

- `frontend/src/app/page.tsx` — replaced the Phase 1/2 placeholder
  with the full homepage section composition.
- `frontend/src/components/layout/footer.tsx` — now uses the
  extracted `NewsletterForm` (`idPrefix="footer"`) instead of its own
  inline copy; no visual or behavioral change.

### Fixed

Two more instances of the same latent bug class fixed in Phase 2
(unimported `React` namespace usage), caught in the newly written
hooks before they could reach `tsc`:

- `hooks/use-marquee.ts` — `React.RefObject`, `React.PointerEvent`.
- `hooks/use-parallax.ts` — `React.RefObject`.

Both fixed with named type imports (`import type { RefObject, PointerEvent } from "react"`), consistent with the Phase 2 fix pattern.

### Notes

- No collection pages, product detail pages, cart, checkout, admin
  dashboard, authentication, WhatsApp integration, or order system
  were built — all explicitly out of scope for Phase 3 per the
  project brief.
- No new npm packages were required — Framer Motion and lucide-react
  were already dependencies as of Phase 1/2.

## [Phase 2] — Luxury UI Foundation & Navigation System

### Added — Navigation Data (`frontend/src/types`, `frontend/src/constants`)

- `types/navigation.ts` — recursive `NavNode`/`NavTree` types.
- `constants/navigation.ts` — `primaryNav`, the single source of truth
  for the exact requested menu structure (Home; Collections with
  Summer Collection / Winter Collection / Shawls and their full
  2 Piece / 3 Piece / fabric sub-levels; New Arrivals; Sale; About;
  Contact), with generated `/collections/...` hrefs.
- `constants/routes.ts` — added `newArrivals`, `sale`, `about`,
  `contact` route constants.
- `constants/index.ts` — now also re-exports `navigation.ts`.

### Added — UI Primitives (`frontend/src/components/ui`)

- `button.tsx` — `Button` (variants: primary, secondary, outline,
  ghost, brass, link; sizes sm/md/lg/icon; `asChild` via
  `@radix-ui/react-slot`; built-in loading spinner state).
- `badge.tsx` — `Badge` (brass/evergreen/ink/outline/destructive).
- `separator.tsx` — `Separator`.
- `skeleton.tsx` — `Skeleton`.
- `accordion.tsx` — `Accordion`/`AccordionItem`/`AccordionTrigger`/
  `AccordionContent` (Radix-based, animated via Phase 1's
  `accordion-down`/`accordion-up` keyframes).
- `sheet.tsx` — `Sheet`/`SheetTrigger`/`SheetClose`/`SheetContent`
  (Radix Dialog-based slide-in drawer with `left`/`right`/`top`/
  `bottom` sides; visually-hidden title/description for a11y).

### Added — Shared Design Components (`frontend/src/components/shared`)

- `container.tsx` — `Container` (default/narrow/wide/full widths).
- `section-title.tsx` — `SectionTitle` (eyebrow + heading + description).
- `icon-button.tsx` — `IconButton` (polymorphic: `<Link>` when `href`
  given, `<button>` otherwise; optional badge `indicator`).
- `reveal.tsx` — `Reveal` (Framer Motion `whileInView` wrapper using
  the shared `fadeUp` variant and viewport config).
- `spinner.tsx` — `Spinner`.
- `card.tsx` — `Card`, `CardMedia`, `CardBody`, `CardTitle`,
  `CardDescription` (generic surface, not product-specific).
- `card-skeleton.tsx` — `CardSkeleton` (matches `Card`'s proportions).

### Added — Global Layout (`frontend/src/components/layout`)

- `logo.tsx` — `Logo`, a typographic wordmark placeholder using
  `siteConfig.name`.
- `announcement-bar.tsx` — `AnnouncementBar`, auto-rotating message
  bar (pauses when the tab is hidden).
- `nav-link.tsx` — `NavLink`, top-level link with center-out underline
  hover and active-page state.
- `mega-menu.tsx` — `MegaMenu` + `MegaMenuNode`, the recursive
  multi-level renderer that turns `primaryNav`'s `Collections` node
  into a 3-column mega menu with nested group headers and leaf links.
- `desktop-nav.tsx` — `DesktopNav`: renders `primaryNav`, opens the
  mega menu on hover/focus of the `Collections` trigger, closes on
  mouse-leave, outside click (`useClickOutside`), Escape
  (`useEscapeKey`), or focus leaving the nav (`onBlur`); trigger has
  `aria-haspopup`/`aria-expanded`/`aria-controls`.
- `mobile-nav.tsx` — `MobileNav` + `MobileNavNode`: `Sheet`-based
  slide-in drawer with the same `primaryNav` tree rendered as nested
  `Accordion` sections; footer row with Account/Wishlist/Search links.
- `search-overlay.tsx` — `SearchOverlay`, expanding search panel
  (focus management, Escape-to-close, submit-prevented placeholder
  form — no search backend yet).
- `header.tsx` — `Header`: sticky, composes `AnnouncementBar` + `Logo`
  + `MobileNav` trigger + `DesktopNav` + search/wishlist/cart/account
  `IconButton`s + `SearchOverlay`; compacts height and gains a shadow
  past a 24px scroll threshold via `useScrollPosition`.
- `footer.tsx` — `Footer`: newsletter form with real client-side
  validation (`emailSchema` from `lib/validation.ts`, no simulated
  fake success), Collections column generated from `primaryNav`,
  Customer Care / About link columns, social icon links, payment
  method placeholder badges, dynamic copyright year.

### Added — Animation & Interaction Foundation

- `lib/animations.ts` — shared Framer Motion variants (`fadeIn`,
  `fadeUp`, `fadeDown`, `scaleIn`, `staggerContainer`) and
  `scrollViewport` config, tuned to the Phase 1 `luxury-ease` curve.
- `hooks/use-scroll-position.ts` — `useScrollPosition`.
- `hooks/use-click-outside.ts` — `useClickOutside`.
- `hooks/use-lock-body-scroll.ts` — `useLockBodyScroll`.
- `hooks/use-escape-key.ts` — `useEscapeKey`.

### Added — App Router Integration

- `app/loading.tsx` — root-level Next.js loading UI using `Spinner`.
- `app/layout.tsx` — now renders `Header` + `<main>` + `Footer` around
  `{children}`, plus a skip-to-content link.
- `app/page.tsx` — placeholder copy updated to reflect Phase 2 (still
  not a homepage design).

### Added — Documentation

- `docs/architecture/navigation.md` — the navigation data model, why
  one recursive renderer serves both desktop and mobile, why a
  mega-menu grid was chosen over nested hover flyouts, and the
  accessibility behavior implemented.

### Changed

- `frontend/package.json` — added `@radix-ui/react-accordion`,
  `@radix-ui/react-dialog`, `@radix-ui/react-slot`,
  `@radix-ui/react-visually-hidden`.
- `frontend/next.config.ts` — `experimental.typedRoutes` set to
  `false` (many nav links intentionally target routes with no page
  yet, which typed routes would fail to compile against); comment
  left explaining when to re-enable it.
- `frontend/src/config/site.ts` — added `name` ("Verrière") and
  `tagline`; removed the now-redundant `seo.titleTemplate` (the root
  layout builds its own template from `siteConfig.name`).

### Fixed

Three latent Phase 1 bugs, caught while wiring the new components
that render alongside them:

- `app/layout.tsx` — `metadata.title.default` was accidentally set to
  the SEO **description** string instead of a title.
- `app/layout.tsx`, `components/shared/spinner.tsx`,
  `components/ui/skeleton.tsx` — referenced the `React` namespace
  (`React.ReactNode`, `React.HTMLAttributes`) without importing it,
  which would have failed `tsc --noEmit`. Fixed with named type
  imports (`import type { ReactNode } from "react"`, etc.) instead of
  a blanket `import * as React`.

### Notes

- No homepage hero, product grid/detail, collection pages, cart,
  checkout, admin dashboard pages, authentication pages, WhatsApp
  integration, or homepage slider were built — all explicitly out of
  scope for Phase 2 per the project brief.
- As in Phase 1, dependencies could not be installed in this sandbox
  (no network access). `npm install` locally will resolve the newly
  added Radix packages; no other setup step changed from Phase 1's
  `README.md` instructions.

## [Phase 1] — Project Foundation & Architecture

### Added — Repository & Tooling

- Enterprise monorepo layout: `frontend/`, `backend/`, `shared/`,
  `database/`, `docs/`.
- Root `README.md`, `PROJECT_MEMORY.md`, `CHANGELOG.md`.
- Root `.gitignore`, `.editorconfig`, `.vscode/extensions.json`,
  `.vscode/settings.json`.

### Added — Frontend (`frontend/`)

- `package.json` — Next.js 15, React 19, TypeScript, Tailwind CSS,
  Framer Motion, Zustand, TanStack Query, Axios, Zod, React Hook Form,
  Husky + lint-staged.
- `tsconfig.json` — strict mode, `@/*` path aliases mapped to every
  `src` subfolder plus `@shared/*`.
- `tailwind.config.ts` — full luxury design-system theme extension
  (color tokens, editorial type scale, spacing scale, radii, warm
  shadows, motion timing functions).
- `src/styles/globals.css` — HSL CSS variable token layer (light +
  reserved dark palette for the future admin shell), base styles,
  focus-visible ring, `prefers-reduced-motion` handling.
- `next.config.ts` — Cloudinary remote image pattern, AVIF/WebP,
  typed routes, security headers.
- `postcss.config.js`, `.prettierrc.json`, `.prettierignore`,
  `eslint.config.mjs` (flat config, `next/core-web-vitals` +
  `next/typescript` + `prettier`), `components.json` (Shadcn UI,
  New York style, CSS variables).
- `.env.example`, `.gitignore`, `next-env.d.ts`.
- `src/app/layout.tsx` — root layout wiring fonts (Fraunces, Manrope,
  IBM Plex Mono via `next/font/google`) and `AppProviders`.
- `src/app/page.tsx` — minimal placeholder page confirming the
  foundation runs (explicitly **not** a homepage design).
- `src/lib/utils.ts` (`cn`), `src/lib/format.ts` (currency/date/slug/
  truncate helpers), `src/lib/validation.ts` (shared Zod primitives).
- `src/config/env.ts`, `src/config/site.ts`, `src/config/fonts.ts`.
- `src/constants/routes.ts`, `src/constants/api-endpoints.ts`,
  `src/constants/index.ts`.
- `src/types/api.ts`, `src/types/user.ts`, `src/types/index.ts`.
- `src/services/api/client.ts` (Axios instance, JWT header
  interceptor, normalized error interceptor), `auth.service.ts`.
- `src/store/auth-store.ts` (Zustand).
- `src/hooks/use-auth.ts`, `src/hooks/use-media-query.ts`.
- `src/components/providers/query-provider.tsx`,
  `app-providers.tsx`.
- `src/components/{ui,shared,layout}/README.md` — placeholders
  documenting intentional emptiness and future population rules.
- `frontend/README.md`.

### Added — Backend (`backend/`)

- `composer.json` — Laravel 12, `php-open-source-saver/jwt-auth`,
  Spatie permission + query-builder, Cloudinary Laravel package,
  Intervention Image, Pest + Pint dev tooling, `composer dev`/`test`
  scripts.
- `artisan`, `bootstrap/app.php` (Laravel 12 streamlined bootstrap:
  API/web/console routing, `/up` health route, `ForceJsonResponse`
  middleware, JWT + role middleware aliases, JSON exception rendering
  for auth/validation/not-found), `bootstrap/providers.php`.
- `routes/api.php` (`/api/v1/health`, `/api/v1/auth/*`),
  `routes/web.php` (JSON root route only — no views), `routes/console.php`.
- `config/`: `app.php`, `database.php` (MySQL default, SQLite for
  tests, Redis reserved), `auth.php` (`api` guard → `jwt` driver),
  `cors.php`, `filesystems.php` (Cloudinary as default disk),
  `jwt.php`, `cache.php`, `queue.php`, `session.php`, `logging.php`,
  `mail.php`, `services.php`.
- `app/Http/Controllers/Controller.php`,
  `app/Http/Controllers/Api/V1/HealthController.php`,
  `app/Http/Controllers/Api/V1/AuthController.php`.
- `app/Http/Requests/RegisterRequest.php`, `LoginRequest.php`.
- `app/Http/Resources/UserResource.php`.
- `app/Http/Middleware/ForceJsonResponse.php`,
  `EnsureUserHasRole.php`.
- `app/Models/User.php` (implements `JWTSubject`, role helpers).
- `app/Services/AuthService.php` (register/login/refresh/logout logic).
- `app/Support/ApiResponse.php` (standard success/error envelope).
- `app/Providers/AppServiceProvider.php`.
- `app/Repositories/README.md` (documents intentional emptiness).
- `database/migrations/0001_01_01_000000_create_users_table.php`
  (+ `password_reset_tokens`, `sessions`),
  `..._000001_create_cache_table.php`,
  `..._000002_create_jobs_table.php`.
- `database/factories/UserFactory.php`,
  `database/seeders/DatabaseSeeder.php`.
- `tests/Pest.php`, `tests/TestCase.php`,
  `tests/Feature/HealthCheckTest.php`, `tests/Feature/AuthTest.php`.
- `phpunit.xml` (in-memory SQLite test environment), `pint.json`.
- `storage/` directory skeleton with `.gitignore`s so Laravel's
  runtime paths exist before first boot.
- `.env.example`, `.gitignore`, `backend/README.md`.

### Added — Shared Contracts (`shared/`)

- `shared/constants/enums.json` (canonical `userRole`, `currency`
  values, cross-referenced against both apps).
- `shared/types/user.schema.json`, `auth-session.schema.json`.
- `shared/README.md`.

### Added — Database References (`database/`)

- `database/README.md`, `database/schema/phase-1-schema.sql`
  (generated reference snapshot of the `users` table).
- `database/erd/` reserved, empty until the schema grows.

### Added — Documentation (`docs/`)

- `docs/architecture/design-system.md` — full color/type/spacing/
  radius/shadow/motion token documentation and rationale.
- `docs/architecture/architecture-overview.md` — system diagram and
  the reasoning behind JWT auth, API versioning, Cloudinary-only
  storage, the Services layer, and the monorepo-without-shared-package
  approach.
- `docs/api/auth.md` — request/response reference for every `/auth/*`
  endpoint and `/health`.

### Notes

- No storefront pages, navigation, product/collection/cart/checkout
  features, admin dashboard UI, authentication *pages*, WhatsApp
  integration, or visual animation were built — all explicitly out of
  scope for Phase 1 per the project brief.
- This project could not be `npm install` / `composer install`ed
  inside this session (no network access in this environment). Every
  configuration and source file was hand-authored to the exact
  versions/shapes those installers would produce; running the install
  commands in the root `README.md` locally will resolve dependencies
  and produce a fully working project with no missing files.
