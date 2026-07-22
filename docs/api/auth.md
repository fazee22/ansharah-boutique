# API Reference — Auth (v1)

Base URL: `{APP_URL}/api/v1`
All responses use the envelope described in `shared/types/`:
`{ success, message, data, errors?, meta? }`.

## POST `/auth/register`

Creates a customer account and returns a session.

**Body**

| Field                   | Type   | Rules                                      |
|--------------------------|--------|-----------------------------------------------|
| `name`                    | string  | required, 2–120 chars                        |
| `email`                   | string  | required, valid email, unique                |
| `password`                | string  | required, min 8, mixed case + number          |
| `password_confirmation`   | string  | required, must match `password`              |

**201 Response**

```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": { "id": "1", "name": "Jane Doe", "email": "jane@example.com", "role": "customer", "emailVerifiedAt": null, "createdAt": "2026-07-11T10:00:00+00:00" },
    "accessToken": "eyJ...",
    "expiresAt": "2026-07-11T11:00:00+00:00"
  }
}
```

## POST `/auth/login`

**Body:** `email`, `password`.
**200** → same shape as register. **401** on invalid credentials.

## POST `/auth/logout` 🔒

Invalidates the current JWT. Requires `Authorization: Bearer <token>`.

## POST `/auth/refresh` 🔒

Exchanges a still-valid (or within-grace-period) token for a new one.
Returns the same session shape as login.

## GET `/auth/me` 🔒

Returns the authenticated user.

```json
{ "success": true, "message": "Current user retrieved.", "data": { "id": "1", "name": "Jane Doe", "...": "..." } }
```

## GET `/health`

Unauthenticated liveness check.

```json
{ "success": true, "message": "Service is healthy.", "data": { "status": "ok", "database": "connected", "timestamp": "..." } }
```

---

🔒 = requires `Authorization: Bearer <accessToken>` header (`jwt.auth`
middleware, see `backend/routes/api.php`).

Commerce endpoints (products, collections, cart, checkout, orders) are
documented here as they are introduced in their respective phases.
