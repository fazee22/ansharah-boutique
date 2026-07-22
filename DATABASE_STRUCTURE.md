# Database Structure

Every table in the schema, grouped by domain, with columns, relationships,
and the reasoning behind non-obvious design choices. All tables use
`utf8mb4`/InnoDB (Laravel's defaults) and every migration lives in
`backend/database/migrations/`, named chronologically by the phase that
introduced it.

For the API surface built on top of this schema, see
[API_DOCUMENTATION.md](./API_DOCUMENTATION.md). For deeper architectural
reasoning on specific tables, see `docs/architecture/admin-dashboard.md`.

## Entity Overview

```
users ─┬─< addresses
       ├─< orders ─┬─< order_items
       │            ├─< order_status_histories
       │            ├─< order_notes
       │            └─< payments
       ├─< wishlist_items >─ products
       ├─< customer_notes (as customer)
       └─< customer_notes (as author)

categories ─┬─< categories (self-referencing: parent_id)
            └─< products ─< product_images

settings          (standalone key-value store)
slides            (standalone, type-discriminated: hero | marquee)
newsletter_subscribers   (standalone)
contact_messages         (standalone)
```

## Authentication & Users

### `users`
The single table for both admin/staff accounts and customers — distinguished
by `role`, not separate tables, since both are fundamentally "a person who
can authenticate."

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `name` | string | |
| `email` | string, unique | |
| `phone` | string, nullable | Added Phase 7 |
| `email_verified_at` | timestamp, nullable | |
| `password` | string | Hashed automatically via an Eloquent cast, never stored plain |
| `role` | enum | `customer`, `admin`, `super_admin` |
| `account_status` | enum | `active`, `blocked` — added Phase 7 |
| `remember_token` | string, nullable | |
| `created_at` / `updated_at` | timestamp | |

**Relationships**: `hasMany` Address, Order, WishlistItem, CustomerNote (as
customer); `hasMany` CustomerNote (as author, via `author_id`).

### `cache`, `jobs`
Laravel framework defaults — back the `database` cache and queue drivers
respectively (see `backend/.env`'s `CACHE_STORE`/`QUEUE_CONNECTION`). Not
application-specific; documented here only for completeness.

## Catalog

### `categories`
Self-referencing tree — **one table backs both "Collections" and
"Categories"** in the admin UI. A depth-0 row (`parent_id IS NULL`) is
presented as a Collection (Summer Collection, Winter Collection, Shawls);
everything deeper is a Category. See `docs/architecture/admin-dashboard.md`
for the full reasoning.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `parent_id` | bigint, nullable, FK → `categories.id` | Self-reference |
| `name` | string | |
| `slug` | string, unique | Auto-generated from `name` if not supplied |
| `description` | text, nullable | |
| `image_url` | string, nullable | |
| `position` | unsigned int | Sibling ordering, admin-editable via drag-and-drop |
| `is_visible` | boolean, default true | Storefront visibility toggle |
| `created_at` / `updated_at` | timestamp | |

**Relationships**: `hasMany` self (children), `belongsTo` self (parent),
`hasMany` Product.

### `products`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `category_id` | bigint, FK → `categories.id` | |
| `name` | string | |
| `slug` | string, unique | |
| `sku` | string, unique | |
| `price` | decimal(10,2) | |
| `sale_price` | decimal(10,2), nullable | Validated `< price` at the request layer |
| `description` / `short_description` | text, nullable | |
| `stock_quantity` | unsigned int | |
| `status` | enum | `draft`, `published`, `hidden` |
| `is_featured` | boolean | |
| `is_new_arrival` | boolean | + `new_arrival_position` (unsigned int, nullable) — added Phase 7 for the New Arrivals Manager's custom ordering |
| `is_sale` | boolean | + `sale_position` (unsigned int, nullable) — same, for the Sale Manager |
| `tags` | json | Array of strings |
| `seo_title` / `seo_description` | string/text, nullable | |
| `created_at` / `updated_at` | timestamp | |

**Relationships**: `belongsTo` Category, `hasMany` ProductImage (ordered by
`position`), `hasMany` WishlistItem.

### `product_images`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `product_id` | bigint, FK → `products.id`, cascade delete | |
| `url` | string | Cloudinary URL |
| `public_id` | string | Cloudinary asset id — needed to delete the asset itself, not just the DB row |
| `position` | unsigned int | Drag-and-drop order in the admin |
| `is_featured` | boolean | The image shown first everywhere; exactly one per product |
| `created_at` / `updated_at` | timestamp | |

## Content & Settings

### `settings`
One flexible key-value store backing **six** distinct admin sections —
Website, WhatsApp, SEO, Homepage, Marquee (slider behavior), and Sale
(banner content) — rather than five-plus rigid, mostly-empty tables.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `group` | string, indexed | `website`, `whatsapp`, `seo`, `homepage`, `marquee`, or `sale` |
| `key` | string | e.g. `siteName`, `number`, `defaultTitle` |
| `value` | json, nullable | Any shape — string, number, boolean, array, object |
| `created_at` / `updated_at` | timestamp | |

Unique on `(group, key)`. Reads go through a short-lived cache
(`Setting::forGroup()`), busted on every write.

### `slides`
One table backs both the Hero Banner and the Auto Moving Slider —
structurally identical ("an ordered, enable/disable-able list of images
with an optional label/link"), distinguished by `type`.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `type` | enum, indexed | `hero` or `marquee` |
| `title` / `subtitle` | string, nullable | Hero slides use these; marquee slides typically don't |
| `image_url` | string | |
| `image_public_id` | string, nullable | Cloudinary asset id |
| `link_url` / `cta_label` | string, nullable | |
| `position` | unsigned int | |
| `is_active` | boolean, default true | |
| `created_at` / `updated_at` | timestamp | |

### `newsletter_subscribers`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `email` | string, unique | |
| `source` | string, nullable | e.g. `footer`, `homepage` |
| `subscribed_at` | timestamp | |
| `created_at` / `updated_at` | timestamp | |

### `contact_messages`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `name` / `email` | string | |
| `phone` / `subject` | string, nullable | |
| `message` | text | |
| `is_read` | boolean, default false | |
| `created_at` / `updated_at` | timestamp | |

## Customer Account

### `addresses`
A customer's saved address book — distinct from the JSON snapshots on
`orders` (see below); editing or deleting a saved address here must never
rewrite what a past order says was shipped where.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `user_id` | bigint, FK → `users.id`, cascade delete | |
| `type` | enum | `shipping` or `billing` |
| `label` | string, nullable | e.g. "Home", "Office" |
| `full_name` / `phone` | string | |
| `line1` | string | |
| `line2` | string, nullable | |
| `city` | string | |
| `state` | string, nullable | |
| `postal_code` | string, nullable | |
| `country` | string, default "Pakistan" | |
| `is_default` | boolean | Only one default per customer, enforced in `AccountAddressService` |
| `created_at` / `updated_at` | timestamp | |

### `wishlist_items`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `user_id` | bigint, FK → `users.id`, cascade delete | |
| `product_id` | bigint, FK → `products.id`, cascade delete | |
| `created_at` / `updated_at` | timestamp | |

Unique on `(user_id, product_id)`. **Note**: this table is real and fully
tested, but the storefront's wishlist UI currently reads/writes
`localStorage` instead — see `PROJECT_MEMORY.md`'s Phase 8 notes for why.

### `customer_notes`
Admin-authored notes about a customer (distinct from the customer's own
data) — shown only in the admin dashboard.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `customer_id` | bigint, FK → `users.id`, cascade delete | |
| `author_id` | bigint, FK → `users.id`, nullable, null-on-delete | The admin who wrote it |
| `body` | text | |
| `created_at` / `updated_at` | timestamp | |

## Orders & Payments

### `orders`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `order_number` | string, unique | Human-facing reference, e.g. `VR-260712-A1B2` |
| `user_id` | bigint, FK → `users.id`, nullable, null-on-delete | Null for a guest checkout |
| `customer_name` / `customer_email` / `customer_phone` | string | Snapshot at order time |
| `status` | enum, indexed | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded` |
| `subtotal` / `shipping_fee` / `discount` / `total` | decimal(10,2) | |
| `currency` | string(3), default "PKR" | |
| `payment_method` | enum | `cod`, `card`, `bank_transfer` (broad category) |
| `payment_status` | enum | `unpaid`, `paid`, `refunded` |
| `shipping_address` / `billing_address` | json | **Frozen snapshots**, not FKs into `addresses` — a customer editing their address book later must never rewrite what a past order says |
| `created_at` / `updated_at` | timestamp | |

**Why snapshots, twice over**: both the customer's address (above) and
every line item's product details (below) are stored as point-in-time
copies rather than live references. This is standard e-commerce practice —
it's also what makes real checkout possible without the storefront's mock
catalog and the backend's real `products` table needing to be the same
thing (see `OrderService::createFromCheckout()` and
`PROJECT_MEMORY.md`'s Phase 10 notes).

### `order_items`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `order_id` | bigint, FK → `orders.id`, cascade delete | |
| `product_id` | bigint, FK → `products.id`, nullable, null-on-delete | Convenience link back to a *real* product, when one exists — always null for checkout orders placed against the mock storefront catalog |
| `product_name` / `product_sku` / `product_image_url` | string | Snapshot |
| `unit_price` | decimal(10,2) | Snapshot |
| `quantity` | unsigned int | |
| `line_total` | decimal(10,2) | |
| `created_at` / `updated_at` | timestamp | |

### `order_status_histories`
The automatic audit trail behind the Order Timeline UI — one row per
status transition, written by `OrderService::updateStatus()` (admin manual
changes) and `PaymentService::markOrderPaid()` (automatic, on a successful
payment).

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `order_id` | bigint, FK → `orders.id`, cascade delete | |
| `status` | string | |
| `changed_by` | bigint, FK → `users.id`, nullable, null-on-delete | Null for system-triggered changes (e.g. payment success) |
| `note` | text, nullable | |
| `created_at` / `updated_at` | timestamp | |

### `order_notes`
Free-form admin notes on an order — distinct from the automatic
`order_status_histories` log above.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `order_id` | bigint, FK → `orders.id`, cascade delete | |
| `author_id` | bigint, FK → `users.id`, nullable, null-on-delete | |
| `body` | text | |
| `created_at` / `updated_at` | timestamp | |

### `payments`
A payment **attempt** log — deliberately separate from `orders.payment_status`,
since one order can have multiple attempts (e.g. a failed card charge
followed by a successful retry with a different gateway); the order column
is just the current settled state.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, PK | |
| `order_id` | bigint, FK → `orders.id`, cascade delete | |
| `gateway` | enum | `stripe`, `jazzcash`, `easypaisa`, `cod` |
| `status` | enum, indexed with `order_id` | `pending`, `processing`, `succeeded`, `failed`, `refunded` |
| `amount` | decimal(10,2) | |
| `currency` | string(3) | |
| `transaction_id` | string, nullable | The gateway's own reference |
| `gateway_response` | json, nullable | Raw response payload, for support/debugging |
| `failure_reason` | text, nullable | |
| `created_at` / `updated_at` | timestamp | |

## Design Principles Applied Throughout

1. **Snapshot over reference, when history matters.** `orders`/`order_items`
   never let a later edit rewrite what actually happened at checkout time.
2. **One flexible table over many rigid ones, for admin-configurable data.**
   `settings` and `categories` both apply this — see
   `docs/architecture/admin-dashboard.md` for the fuller reasoning.
3. **Every destructive foreign key is deliberate.** `cascadeOnDelete()` is
   used where the child genuinely can't exist without the parent (e.g.
   `product_images` without a `product`); `nullOnDelete()` is used where
   the child should survive (e.g. an `order` shouldn't vanish if the
   `user` account placing it is later deleted).
4. **Every admin action that changes something meaningful is logged
   somewhere real** — `order_status_histories` for order state,
   `activity` log channel (see `backend/config/logging.php`) for broader
   admin actions.
