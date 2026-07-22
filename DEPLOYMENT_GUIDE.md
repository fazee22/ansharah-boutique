# Deployment Guide

Taking this project from local development to a real production server.
For local setup, see [INSTALLATION.md](./INSTALLATION.md) instead.

## 1. Deployment Shape

Frontend and backend are independently deployable — they only communicate
over the versioned REST API (`/api/v1`), never share a filesystem or
process. A typical production layout:

```
┌─────────────────────┐      HTTPS (REST API)      ┌──────────────────────┐
│  Next.js frontend    │ ─────────────────────────▶ │  Laravel API backend │
│  (Vercel / Node host)│ ◀───────────────────────── │  (VPS / Forge / etc.)│
└─────────────────────┘                              └───────────┬──────────┘
                                                                    │
                                                          ┌─────────┴─────────┐
                                                          │  MySQL 8  │  Cloudinary │
                                                          └───────────────────┘
```

Recommended, but not required:
- **Frontend**: [Vercel](https://vercel.com) (built for Next.js — zero-config
  App Router support, automatic preview deployments) or any Node 20+ host.
- **Backend**: [Laravel Forge](https://forge.laravel.com), a plain Ubuntu
  VPS, or any platform that runs PHP-FPM + Nginx/Apache behind HTTPS.
- **Database**: managed MySQL 8 (e.g. PlanetScale, RDS, DigitalOcean
  Managed Databases) rather than a self-hosted instance, for backups and
  failover.
- **Media**: Cloudinary is already the only image store this app uses —
  nothing extra to provision.

## 2. Pre-Deployment Checklist

Work through this before flipping anything live:

- [ ] Every payment gateway you intend to accept has **real** credentials
      set (see [§6](#6-payment-gateways-going-live)) — Cash on Delivery
      needs none and works immediately.
- [ ] `backend/.env`'s `APP_ENV=production` and `APP_DEBUG=false` (a
      debug-mode stack trace leaking to a real customer is a real security
      issue, not just untidy).
- [ ] A real `MAIL_MAILER` is configured (not `log`) — see [§7](#7-email-in-production).
- [ ] `CORS`/`FRONTEND_URL` in `backend/.env` point at your real production
      frontend domain, not `localhost`.
- [ ] `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_APP_URL` in
      `frontend/.env.local` (or your host's environment variable panel)
      point at your real production API and frontend domains respectively.
- [ ] `php artisan test` passes against a fresh database.
- [ ] `npm run build` completes with no errors from `frontend/`.
- [ ] You've read and understood [§9, Security Checklist](#9-security-checklist-before-launch).

## 3. Backend Deployment (Laravel)

### 3.1 Server requirements

Same as [INSTALLATION.md's prerequisites](./INSTALLATION.md#1-prerequisites)
(PHP 8.3+, the same extension list, Composer, MySQL 8) — a production
server just needs them installed system-wide instead of on your laptop.

### 3.2 Deploy steps

```bash
git clone <your-repo-url>
cd luxury-ecommerce/backend

composer install --no-dev --optimize-autoloader

cp .env.example .env
# Fill in every production value — see §4 below

php artisan key:generate
php artisan jwt:secret
php artisan migrate --force   # --force skips the "are you sure, this is production" prompt
php artisan db:seed --class=SettingsSeeder --force   # seed sensible settings defaults only — skip ProductSeeder/OrderSeeder in production

php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Do not run the full `--seed`** in production the way you do locally —
`ProductSeeder`/`OrderSeeder`/`AddressSeeder` create realistic *demo* data
(picsum.photos placeholder images, fake customers) meant for local
development and screenshots, not a live store. Run `SettingsSeeder` and
`CategorySeeder` only (real defaults + your real category tree), then
create your real admin account and real products through the admin panel
itself.

Point your web server (Nginx/Apache) at `backend/public/` as the document
root, running PHP-FPM. A minimal Nginx server block:

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    root /var/www/luxury-ecommerce/backend/public;

    ssl_certificate     /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    index index.php;
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 3.3 Queue worker (required in production)

Locally, `MAIL_MAILER=log` means an unprocessed queue is harmless. In
production, order confirmation emails (and anything else queued) will sit
unsent until something processes the queue. Run a persistent worker via
a process manager — Supervisor is the standard choice:

```ini
; /etc/supervisor/conf.d/luxury-queue.conf
[program:luxury-queue]
command=php /var/www/luxury-ecommerce/backend/artisan queue:work --sleep=3 --tries=3
directory=/var/www/luxury-ecommerce/backend
autostart=true
autorestart=true
user=www-data
numprocs=2
```

### 3.4 After every deploy

```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan queue:restart   # picks up any code changes affecting queued jobs
```

## 4. Backend Environment Variables (production values)

Every variable is documented inline in `backend/.env.example`; the ones
that specifically change between local and production:

| Variable | Local | Production |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `APP_URL` | `http://127.0.0.1:8000` | `https://api.yourdomain.com` |
| `FRONTEND_URL` | `http://127.0.0.1:3000` | `https://yourdomain.com` |
| `DB_*` | local MySQL | your managed MySQL instance |
| `MAIL_MAILER` | `log` | `smtp` (or your provider's driver — see §7) |
| `CLOUDINARY_*` | your dev Cloudinary account | can be the same account, or a separate production one |
| `DEFAULT_PAYMENT_GATEWAY` | `cod` | whichever gateway you want customers to see first |
| `STRIPE_*` / `JAZZCASH_*` / `EASYPAISA_*` | blank | real live credentials (§6) |

## 5. Frontend Deployment (Next.js)

### 5.1 Deploying to Vercel (recommended)

1. Import the repository into Vercel, setting the **root directory** to
   `frontend/` (Vercel needs to know this is a monorepo).
2. Framework preset: Next.js (auto-detected).
3. Add every `NEXT_PUBLIC_*` variable from `frontend/.env.example` in
   Vercel's Environment Variables panel, with production values.
4. Deploy. Vercel handles build caching, image optimization, and edge
   delivery automatically.

### 5.2 Deploying to a plain Node host

```bash
cd frontend
npm install
npm run build
npm run start   # serves on port 3000 by default; put Nginx in front for HTTPS/domain routing
```

Run `npm run start` under a process manager (PM2, Supervisor) the same way
the backend's queue worker is, so it restarts automatically on crash or
server reboot.

## 6. Payment Gateways Going Live

Every gateway reports `configured: false` (via `GET /api/v1/payments/methods`)
until its real credentials are set — nothing needs code changes to activate
one, only `backend/.env`:

- **Cash on Delivery** — already live, no configuration needed.
- **Stripe** — set `STRIPE_KEY`, `STRIPE_SECRET`, and `STRIPE_WEBHOOK_SECRET`
  (from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys));
  register `https://api.yourdomain.com/api/v1/payments/webhook/stripe` as a
  webhook endpoint listening for `checkout.session.completed` and
  `checkout.session.expired`.
- **JazzCash** — set `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`,
  `JAZZCASH_INTEGRITY_SALT` (issued during JazzCash merchant onboarding),
  and set `JAZZCASH_SANDBOX=false` once you're ready for real transactions.
- **EasyPaisa** — set `EASYPAISA_STORE_ID`, `EASYPAISA_HASH_KEY` (issued
  during EasyPaisa merchant onboarding), and `EASYPAISA_SANDBOX=false` when
  ready.

See `docs/architecture/` and `backend/app/Payments/` for how the gateway
abstraction itself works — going live never requires touching that code.

## 7. Email in Production

Set a real mail driver in `backend/.env` — any Laravel-supported SMTP
provider works (Postmark, SES, Mailgun, Resend, plain SMTP):

```ini
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourprovider.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=orders@yourdomain.com
MAIL_FROM_NAME="Verrière"
```

Every email template (`backend/app/Mail/`) is ready; confirm the queue
worker ([§3.3](#33-queue-worker-required-in-production)) is actually
running, or queued emails will never send.

## 8. Analytics & Search Console

Optional, and fully self-gating — set only what you want active, in
`frontend/.env.local` (or your host's environment panel):

```ini
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your-pixel-id
```

After deploying, submit `https://yourdomain.com/sitemap.xml` to
[Google Search Console](https://search.google.com/search-console) — it's
generated dynamically (`frontend/src/app/sitemap.ts`), so it's always
current with no manual regeneration step.

## 9. Security Checklist Before Launch

- [ ] `APP_DEBUG=false` in production — confirmed above, worth double-checking.
- [ ] `APP_KEY` and `JWT_SECRET` are freshly generated for *this* deployment,
      not copied from a development `.env`.
- [ ] Every real payment gateway's credentials are stored only in
      environment variables — never committed, never hard-coded (see
      `docs/architecture/` and `backend/app/Payments/` — nothing in that
      code path reads a credential any other way).
- [ ] HTTPS is enforced on both the frontend and API domains — the
      backend's `SecurityHeaders` middleware sends `Strict-Transport-Security`
      automatically once requests arrive over HTTPS, but the certificate/
      redirect itself is your server's responsibility.
- [ ] Database credentials are unique to this deployment and not reused
      elsewhere.
- [ ] Your MySQL instance isn't publicly reachable from the internet at
      large — only from your application server.
- [ ] Rate limiting (already applied — see `backend/routes/api.php` and
      `bootstrap/app.php`) is confirmed active by testing a few rapid
      requests against `/api/v1/auth/login` and confirming a 429 eventually.
- [ ] Admin credentials (`admin@luxury.test` / `password`) are the seeded
      **development** account — create a real admin account with a strong,
      unique password before going live, and consider removing or disabling
      the seeded one.

## 10. Rolling Back

Both apps are stateless beyond the database — rolling back a bad deploy is
redeploying the previous commit/build (Vercel keeps every deployment
instantly promotable; on a VPS, `git checkout <previous-sha>` and re-run
the deploy steps in [§3.2](#32-deploy-steps)). Only run `php artisan
migrate:rollback` if the bad deploy included a migration you need to
undo — never do this against production without a fresh backup first.
