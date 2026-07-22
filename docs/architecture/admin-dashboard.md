# Admin Dashboard Architecture

Status: implemented (Phase 6) — real Laravel backend, real JWT auth,
real Cloudinary image upload. No mocked admin functionality.

## Route groups keep the admin shell out of the storefront

`frontend/src/app` splits into `(site)` and `admin`. Route groups
(the parenthesized folder name) are excluded from the URL, so this
refactor changed **no existing link** — `/`, `/collections/...`,
`/products/[slug]`, etc. all resolve exactly as before. What it
bought:

- The root `app/layout.tsx` is now minimal (fonts, providers, global
  toaster only). Storefront chrome (`Header`/`Footer`) moved to
  `(site)/layout.tsx`; the admin sidebar/topbar shell lives entirely
  in `admin/(dashboard)/layout.tsx`. Neither can leak into the other.
- `admin/login/page.tsx` sits **outside** the `(dashboard)` group, so
  it renders without `AdminGuard` wrapping it — avoiding a redirect
  loop where an unauthenticated visit to the login page would
  otherwise immediately redirect back to itself.

## One category tree, not two management surfaces

The brief lists "Category Management" and "Collection Management" as
separate sections with separate CRUD verbs, but "Summer Collection,"
"2 Piece," and "Embroidered Lawn" are structurally identical — nodes
at different depths of the same tree (this mirrors
`frontend/src/constants/navigation.ts`'s `NavNode` shape from Phase
2–4). The backend has one `categories` table
(`backend/database/migrations/..._create_categories_table.php`) and
one `Admin\CategoryController`; the frontend has one `CategoryTree`
component and one `CategoryFormDialog`. The admin UI *presents*
depth-0 nodes as "Collections" (the page header, the "Add Collection"
button) purely as a naming/UX choice — underneath, creating a
collection and creating a category are the same mutation.

This also means "Bulk Category Change" and "Bulk Collection Change"
(two bullet points in the brief) are satisfied by one bulk action
(`change_category`) — there was never a second, different operation
to build.

## Admin panel is real; the storefront still runs on mock data

Every admin CRUD operation (`app/Http/Controllers/Api/V1/Admin/*`)
hits a real MySQL-backed Eloquent model and, for images, the real
`cloudinary` disk configured since Phase 1. This was a deliberate
scope decision: Phase 6's brief is "build an admin dashboard," not
"migrate the storefront onto the backend" — that's a separate,
large undertaking (the storefront's `generateStaticParams`, mock
review/wishlist/cart data, and 140+ pre-generated product pages would
all need to change) not requested by this phase. The two systems
share the same category tree *shape* by design (`CategorySeeder`
mirrors `constants/navigation.ts` exactly) specifically so that a
future "wire the storefront to the real API" phase is a data-mapping
exercise, not a redesign.

## Native HTML5 drag-and-drop, not a DnD library

Both the product image reorder grid and the category tree's sibling
reorder use plain `draggable` + `onDragStart`/`onDragOver`/`onDrop`
handlers, not `@dnd-kit` or `react-beautiful-dnd`. Both use cases are
simple, single-axis (or single-level) reorders where the native
Drag and Drop API is fully sufficient — adding a ~30-40KB dependency
for functionality the platform already provides would be scope
creep, not better engineering.

## Silent token refresh, not just a longer cookie

"Remember Login" is implemented in two parts:
`services/api/client.ts`'s response interceptor retries any 401 once,
transparently, after calling `/auth/refresh` — deduplicated so five
parallel requests failing at once trigger one refresh call, not five.
`store/auth-store.ts`'s `rememberMe` flag then controls how long the
*cookie itself* survives in the browser (up to `backend/config/jwt.php`'s
14-day `refresh_ttl`), since the access token is always short-lived
(~60 minutes) regardless. Without this, a longer cookie alone would
just mean the browser holds onto a token that expired hours ago.

## Honest dashboard stats, not fabricated ones

Orders, Customers, and Revenue are explicitly Phase 7 (see the brief's
"DO NOT BUILD" list). `DashboardService::stats()` (backend) returns
`null` for those three figures rather than inventing numbers;
`StatCard` (frontend) renders an explicit "Available in Phase 7"
state when it receives `null`, and "Best Selling Products" is
honestly reframed as "Featured Products" (an admin-controlled signal)
rather than faking a sales ranking that has no data behind it yet.
The dashboard's revenue chart is a static SVG-bar silhouette for the
same reason — the brief itself asks for "Beautiful Charts placeholders
(backend integration ready)," so this is the requested shape, not a
shortcut.
