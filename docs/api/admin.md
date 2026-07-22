# API Reference — Admin (v1)

Base URL: `{APP_URL}/api/v1/admin`
Every route below requires `Authorization: Bearer <token>` **and**
an `admin` or `super_admin` role (`jwt.auth` + `role:admin,super_admin`
middleware). A non-admin authenticated user gets `403`; no token gets
`401`.

Local dev admin login: `admin@luxury.test` / `password` (seeded by
`DatabaseSeeder`).

## Dashboard

**GET `/dashboard`** — stats, low-stock products, featured products,
recent activity. `stats.totalOrders`, `totals.totalCustomers`, and
`stats.revenue` are `null` — Orders/Customers are Phase 7.

## Categories

Self-referencing tree — depth 0 = a "Collection" in the admin UI,
deeper nodes are "Categories." One table, one set of endpoints.

| Method | Path | Notes |
|---|---|---|
| GET | `/categories` | Flat, paginated. `?tree=1` returns the full nested tree instead. `?parent_id=`, `?search=` |
| POST | `/categories` | `name` required; `slug` auto-generated if omitted |
| GET | `/categories/{id}` | |
| PUT/PATCH | `/categories/{id}` | |
| DELETE | `/categories/{id}` | 422 if it still has children or products |
| PATCH | `/categories/{id}/toggle-visibility` | |
| POST | `/categories/reorder` | `{ items: [{ id, position }] }` |

## Products

| Method | Path | Notes |
|---|---|---|
| GET | `/products` | `?search=`, `?category_id=`, `?status=`, `?featured=1`, `?sale=1`, `?sort=newest\|oldest\|name\|price_asc\|price_desc\|stock`, paginated |
| POST | `/products` | See fields below |
| GET | `/products/{id}` | |
| PUT/PATCH | `/products/{id}` | |
| DELETE | `/products/{id}` | Also removes the product's Cloudinary assets |
| POST | `/products/{id}/duplicate` | Copies all fields + images; always creates a `draft` |
| POST | `/products/bulk-action` | `{ product_ids: number[], action: "delete"\|"publish"\|"draft"\|"hide"\|"change_category", category_id? }` |

**Product fields**: `category_id`, `name`, `slug?`, `sku`, `price`,
`sale_price?` (must be less than `price`), `description?`,
`short_description?`, `stock_quantity`, `status`
(`draft`/`published`/`hidden`), `is_featured?`, `is_new_arrival?`,
`is_sale?`, `tags?` (string array), `seo_title?`, `seo_description?`.

## Product Images

| Method | Path | Notes |
|---|---|---|
| POST | `/products/{id}/images` | `multipart/form-data`, field `image` (jpeg/png/webp, max 8MB), one file per request |
| DELETE | `/products/{id}/images/{imageId}` | 422 if it's the product's last remaining image |
| PATCH | `/products/{id}/images/{imageId}/featured` | |
| POST | `/products/{id}/images/reorder` | `{ items: [{ id, position }] }` |

Images upload to the `cloudinary` disk (`config/filesystems.php`,
configured since Phase 1) — never local storage.

## New Arrivals / Sale Curation (Phase 7)

One controller serves both — pass `?type=new_arrivals` or `?type=sale`.

| Method | Path | Notes |
|---|---|---|
| GET | `/curation?type=` | Curated products, ordered by position |
| POST | `/curation/{productId}/add?type=` | |
| POST | `/curation/{productId}/remove?type=` | |
| POST | `/curation/reorder` | `{ type, items: [{ id, position }] }` |

## Orders (Phase 7)

| Method | Path | Notes |
|---|---|---|
| GET | `/orders` | `?search=`, `?status=`, `?payment_status=`, `?sort=newest\|oldest\|total_desc\|total_asc`, paginated |
| GET | `/orders/{id}` | Includes items, status history, notes |
| PATCH | `/orders/{id}/status` | `{ status, note? }` — logs to `order_status_histories` automatically |
| POST | `/orders/{id}/notes` | `{ body }` |

## Customers (Phase 7)

| Method | Path | Notes |
|---|---|---|
| GET | `/customers` | `?search=`, `?account_status=`, paginated |
| GET | `/customers/{id}` | Returns `{ customer, stats }` — stats are lifetime order count/spend |
| PATCH | `/customers/{id}/status` | `{ account_status: "active"\|"blocked" }` |
| POST | `/customers/{id}/notes` | `{ body }` |

## Slides — Hero Banner + Auto Moving Slider (Phase 7)

One controller/table serves both — pass `?type=hero` or `?type=marquee`.

| Method | Path | Notes |
|---|---|---|
| GET | `/slides?type=` | Ordered by position |
| POST | `/slides` | `multipart/form-data`: `type`, `image`, optional `title`/`subtitle`/`link_url`/`cta_label` |
| PUT | `/slides/{id}` | Edit fields (no image replace — delete + re-upload) |
| DELETE | `/slides/{id}` | |
| PATCH | `/slides/{id}/toggle-active` | |
| POST | `/slides/reorder` | `{ type, items: [{ id, position }] }` |

## Settings (Phase 7)

One key-value table serves six groups: `website`, `whatsapp`, `seo`,
`homepage`, `marquee`, `sale`.

| Method | Path | Notes |
|---|---|---|
| GET | `/settings` | Returns all six groups in one payload |
| PUT | `/settings` | `{ group, values: {...} }` — replaces every key in that group |

## Newsletter Subscribers (Phase 7)

| Method | Path | Notes |
|---|---|---|
| GET | `/newsletter-subscribers` | `?search=`, paginated |
| DELETE | `/newsletter-subscribers/{id}` | |
| GET | `/newsletter-subscribers/export` | Streams a CSV download |

Public (no auth): **POST `/api/v1/newsletter/subscribe`** —
`{ email, source? }`, backs the storefront footer/homepage forms.

## Scope note

These endpoints power the **admin dashboard only**. The public
storefront (`frontend/src/app/(site)`) still runs on the frontend's
own mock catalog (`frontend/src/lib/mock/products.ts`) — the two
aren't wired together yet. See `PROJECT_MEMORY.md`'s Phase 6 notes
for the reasoning.
