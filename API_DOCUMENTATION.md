# API Documentation

The complete REST API reference for the backend. Base URL for every
endpoint below: `{APP_URL}/api/v1` (e.g. `http://127.0.0.1:8000/api/v1`
locally).

This is the master index — the **Admin API** section links out to
[`docs/api/admin.md`](./docs/api/admin.md), which already documents that
surface in full, rather than duplicating ~40 endpoints here. Every other
section (Auth, Account, Public/Storefront, Payments) is documented
completely in this file.

## Response Envelope

Every endpoint returns the same JSON shape:

```json
// Success
{ "success": true, "message": "...", "data": { ... }, "meta": { ... } }

// Error
{ "success": false, "message": "...", "errors": { "field": ["..."] } }
```

`meta` is present only on paginated list endpoints:
```json
"meta": { "currentPage": 1, "perPage": 20, "total": 87, "lastPage": 5 }
```

## Authentication

JWT, stateless — no cookies/sessions on the API side. Obtain a token from
`/auth/login` or `/auth/register`, then send it on every authenticated
request:

```
Authorization: Bearer <accessToken>
```

Tokens expire after ~60 minutes; call `/auth/refresh` with the current
(even just-expired) token to get a new one. The frontend does this
automatically via a response interceptor — see
`frontend/src/services/api/client.ts`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | Public | Creates a customer account, returns a session. Rate limited (5/min). |
| POST | `/auth/login` | Public | Rate limited (5/min). |
| POST | `/auth/logout` | Required | |
| POST | `/auth/refresh` | Required | |
| GET | `/auth/me` | Required | Current user's own profile |

Full request/response detail: [`docs/api/auth.md`](./docs/api/auth.md).

Every route below marked **Required** needs the `Authorization` header
above. Routes under `/admin/*` additionally require the `admin` or
`super_admin` role — see [`docs/api/admin.md`](./docs/api/admin.md).

## Account API (Authenticated Customers)

Every endpoint here scopes strictly to the calling user — there is no way
to read or modify another customer's data through this surface, enforced
at the query/service layer, not just hidden in a UI.

### Profile

| Method | Path | Body |
|---|---|---|
| GET | `/account/profile` | — |
| PUT | `/account/profile` | `{ name, email, phone? }` |
| PUT | `/account/password` | `{ current_password, password, password_confirmation }` |

### Addresses

| Method | Path | Notes |
|---|---|---|
| GET | `/account/addresses` | |
| POST | `/account/addresses` | `{ type, label?, full_name, phone, line1, line2?, city, state?, postal_code?, country, is_default? }` |
| PUT | `/account/addresses/{id}` | Same fields, all optional |
| DELETE | `/account/addresses/{id}` | 403 if the address belongs to someone else |
| PATCH | `/account/addresses/{id}/default` | |

### Orders

| Method | Path | Notes |
|---|---|---|
| GET | `/account/orders` | Paginated, newest first |
| GET | `/account/orders/{id}` | 404 (not 403) if the order isn't yours — doesn't confirm the order exists |

### Wishlist

| Method | Path | Notes |
|---|---|---|
| GET | `/account/wishlist` | |
| POST | `/account/wishlist/{productId}` | |
| DELETE | `/account/wishlist/{productId}` | |
| POST | `/account/wishlist/merge` | `{ product_ids: number[] }` — folds a guest's local wishlist in on login. Built and tested; not currently called by the frontend — see `PROJECT_MEMORY.md`'s Phase 8 notes. |

## Public / Storefront API

No authentication required for anything in this section.

### Settings & Content

| Method | Path | Notes |
|---|---|---|
| GET | `/settings` | Returns all six settings groups (`website`, `whatsapp`, `seo`, `homepage`, `marquee`, `sale`) in one payload |
| GET | `/slides?type=hero\|marquee` | Active slides only, ordered by position |

### Search & Contact

| Method | Path | Body / Query |
|---|---|---|
| POST | `/newsletter/subscribe` | `{ email, source? }`. Rate limited (10/min). |
| POST | `/contact` | `{ name, email, phone?, subject?, message }`. Rate limited (5/min). |

### Checkout & Orders

| Method | Path | Body |
|---|---|---|
| POST | `/orders` | Places a real order — see shape below. Works for guests and authenticated customers (an authenticated request's order links to their account automatically). Rate limited (10/min). |
| POST | `/orders/lookup` | `{ order_number, email }` — resolves an order for a guest with no account, by number + matching email. Rate limited (20/min). |

**`POST /orders` body:**

```json
{
  "customer_name": "Ayesha Khan",
  "customer_email": "ayesha@example.com",
  "customer_phone": "03001234567",
  "payment_method": "cod",
  "shipping_fee": 250,
  "currency": "PKR",
  "shipping_address": {
    "fullName": "Ayesha Khan",
    "phone": "03001234567",
    "line1": "12 Clifton Road",
    "line2": null,
    "city": "Karachi",
    "postalCode": "75600",
    "country": "Pakistan"
  },
  "items": [
    { "name": "Embroidered Lawn 2-Piece", "sku": "VR-EL-001", "image_url": null, "unit_price": 6500, "quantity": 1 }
  ]
}
```

Returns the created order (`OrderResource` shape — see
[`docs/api/admin.md`](./docs/api/admin.md#orders-phase-7) for the full
field list, which this response reuses).

### Payments

| Method | Path | Notes |
|---|---|---|
| GET | `/payments/methods` | Every gateway and whether it's actually usable (`configured: true/false`) — a gateway missing real credentials reports `false` rather than failing at charge time |
| POST | `/payments/initiate` | `{ order_number, email, gateway }`. Guests must supply the order's own email; an authenticated request is verified by ownership instead. Rate limited (10/min). |
| POST | `/payments/webhook/{gateway}` | Provider-facing only — Stripe/JazzCash/EasyPaisa call this, your frontend never does |
| GET | `/payments/{jazzcash\|easypaisa}/redirect/{reference}` | Signed URLs handed back by `initiate()` for those two gateways — see `backend/app/Payments/Gateways/` |

**`POST /payments/initiate` response:**

```json
{
  "success": true,
  "data": {
    "status": "succeeded",       // or "pending" (redirect-based gateway) or "failed"
    "redirectUrl": null,          // set for Stripe/JazzCash/EasyPaisa; null for Cash on Delivery
    "transactionId": "COD-VR-260712-A1B2"
  }
}
```

## Admin API

Every route under `/admin/*` requires a JWT with the `admin` or
`super_admin` role. Covers Dashboard, Products, Categories, Orders,
Customers, Slides, Settings, Newsletter, and New Arrivals/Sale curation —
roughly 40 endpoints across 9 resource groups.

**Full reference**: [`docs/api/admin.md`](./docs/api/admin.md)

Quick index of resource groups (see that file for every method/path):

| Group | Base path |
|---|---|
| Dashboard | `/admin/dashboard` |
| Categories & Collections | `/admin/categories` |
| Products & Images | `/admin/products` |
| New Arrivals / Sale Curation | `/admin/curation` |
| Orders | `/admin/orders` |
| Customers | `/admin/customers` |
| Slides (Hero + Marquee) | `/admin/slides` |
| Settings | `/admin/settings` |
| Newsletter Subscribers | `/admin/newsletter-subscribers` |

## Rate Limits Summary

| Endpoint(s) | Limit |
|---|---|
| `/auth/login`, `/auth/register` | 5 per minute |
| `/contact` | 5 per minute |
| `/newsletter/subscribe` | 10 per minute |
| `/payments/initiate` | 10 per minute |
| `/orders` (checkout) | 10 per minute |
| `/orders/lookup` | 20 per minute |
| Everything else | 60 per minute (global default) |

Exceeding a limit returns `429 Too Many Requests`.

## Error Responses

| Status | Meaning |
|---|---|
| `401` | Missing/invalid/expired JWT |
| `403` | Authenticated, but not allowed to do this (wrong role, or doesn't own the resource) |
| `404` | Resource not found — or, deliberately, used instead of `403` where confirming a resource *exists* would itself leak information (e.g. another customer's order) |
| `422` | Validation failed — see `errors` in the response body for field-level messages |
| `429` | Rate limit exceeded |
| `500` | Unhandled server error — logged server-side; the response body never includes a stack trace in production (`APP_DEBUG=false`) |
