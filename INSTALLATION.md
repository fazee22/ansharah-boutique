# Installation Guide

Step-by-step setup for running the full project locally — backend, frontend,
database, and media storage. For a two-minute abbreviated version, see the
[README's Quick Start](./README.md#quick-start). For taking this to a real
server, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) instead.

## 1. Prerequisites

Install these before you start:

| Requirement | Version | Check with |
|---|---|---|
| Node.js | 20 LTS or later | `node -v` |
| npm | 10+ (ships with Node) | `npm -v` |
| PHP | 8.3+ | `php -v` |
| Composer | 2.7+ | `composer -V` |
| MySQL | 8.0+ | `mysql --version` |

**Required PHP extensions**: `pdo_mysql`, `mbstring`, `bcmath`, `intl`,
`curl`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`. Laravel
will tell you at `composer install` time if one is missing — install it
through your OS package manager (e.g. `sudo apt install php8.3-mbstring`)
and re-run.

**Also needed:**
- A free [Cloudinary](https://cloudinary.com) account (product/slide image
  storage) — see [§5](#5-cloudinary-setup) below.
- A code editor. This project is built to open directly in
  [Visual Studio Code](https://code.visualstudio.com) — see [§7](#7-running-inside-visual-studio-code).

## 2. Clone and Locate Environment Files

```bash
git clone <your-repo-url> luxury-ecommerce
cd luxury-ecommerce
```

Two apps, two environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Never commit `backend/.env` or `frontend/.env.local`** — both are already
listed in `.gitignore`. Every value below is safe to keep in
`.env.example` (no secrets), which is why those files *are* committed.

## 3. Database Setup

Create an empty MySQL database and a user with access to it:

```sql
CREATE DATABASE luxury_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'luxury_user'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON luxury_ecommerce.* TO 'luxury_user'@'localhost';
FLUSH PRIVILEGES;
```

Then open `backend/.env` and fill in:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=luxury_ecommerce
DB_USERNAME=luxury_user
DB_PASSWORD=a-strong-password
```

## 4. Backend Setup (Laravel API)

```bash
cd backend
composer install
php artisan key:generate      # sets APP_KEY in .env
php artisan jwt:secret        # sets JWT_SECRET in .env
php artisan migrate --seed    # creates every table AND seeds real demo data
```

The `--seed` step creates:
- An admin account: `admin@luxury.test` / `password`
- 10 demo customer accounts (see `database/factories/UserFactory.php`)
- The full category tree (matching the storefront's navigation exactly)
- A starter product catalog with real Cloudinary-ready image records
- Realistic settings defaults, hero/marquee slides, customer addresses,
  ~24 sample orders (with proper status history), and newsletter subscribers

Start the API:

```bash
php artisan serve
```

The API is now running at **http://127.0.0.1:8000**. Confirm it works:

```bash
curl http://127.0.0.1:8000/api/v1/health
# {"success":true,"message":"...","data":{"status":"ok"}}
```

### 4.1 Optional: queue worker

Emails (order confirmations, etc.) are queued, not sent inline. In
development, `MAIL_MAILER=log` in `.env` means "sending" an email just
writes it to `backend/storage/logs/laravel.log` — safe, no real email
account needed. To actually process the queue (so those log entries appear
promptly rather than whenever a request happens to trigger the driver):

```bash
php artisan queue:work
```

Or run API + queue worker together:

```bash
composer run dev
```

## 5. Cloudinary Setup

Product images, slide images, and every other admin-uploaded file are
stored on [Cloudinary](https://cloudinary.com), never on local disk.

1. Create a free Cloudinary account.
2. From your Cloudinary dashboard, copy your **Cloud Name**, **API Key**,
   and **API Secret**.
3. In `backend/.env`:

```ini
FILESYSTEM_DISK=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

That's it — no bucket/folder configuration needed, the app handles paths
itself (see `docs/architecture/admin-dashboard.md` for how uploads are
organized). Without these three values set, image upload in the admin
panel will fail with a clear error rather than silently doing nothing.

## 6. Frontend Setup (Next.js)

In a second terminal, from the repo root:

```bash
cd frontend
npm install
```

Open `frontend/.env.local` and confirm it points at your running backend:

```ini
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

Start it:

```bash
npm run dev
```

The storefront is now running at **http://127.0.0.1:3000**, and the admin
dashboard at **http://127.0.0.1:3000/admin/login**.

Every other frontend env var (Cloudinary unsigned-upload preset, feature
flags, analytics ids) is optional — see the comments in
`frontend/.env.example`; leaving them blank disables the corresponding
feature cleanly rather than breaking anything.

## 7. Running Inside Visual Studio Code

This project is structured to open cleanly as a single VS Code workspace:

1. Open the **`luxury-ecommerce/`** root folder in VS Code (not `frontend/`
   or `backend/` individually) — `.vscode/settings.json` and
   `.vscode/extensions.json` at the root apply editor settings and suggest
   extensions for both apps at once.
2. VS Code will prompt you to install the recommended extensions
   (ESLint, Prettier, Tailwind CSS IntelliSense, PHP Intelephense, Laravel
   Pint). Accept the prompt, or install them manually from the Extensions
   panel.
3. Open two integrated terminals (`` Ctrl+` `` / `` Cmd+` ``, then the split-
   terminal icon) — one `cd backend && php artisan serve`, one
   `cd frontend && npm run dev`.
4. Recommended: install the **Thunder Client** or **REST Client** extension
   if you want to poke at API endpoints directly from VS Code — see
   [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for the full endpoint list.
5. TypeScript/PHP errors surface inline as you edit, since both language
   servers activate automatically once their respective `node_modules` /
   `vendor` directories exist (i.e., after `npm install` / `composer
   install`).

## 8. Verifying Everything Works

Once both servers are running:

- [ ] `http://127.0.0.1:3000` renders the homepage with a hero banner and
      product sections.
- [ ] `http://127.0.0.1:3000/collections/summer-collection/2-piece/embroidered-lawn`
      renders a populated collection page.
- [ ] `http://127.0.0.1:3000/admin/login` — log in with
      `admin@luxury.test` / `password` and confirm the dashboard loads with
      real numbers (products, categories, low stock, etc.).
- [ ] In the admin, open **Products**, edit any product, and confirm the
      image manager loads its existing images.
- [ ] Add an item to your bag on the storefront, go to `/checkout`, fill in
      the form, choose **Cash on Delivery**, and place the order — you
      should land on `/order-confirmation` with a real order number, and
      that order should now appear in **Admin → Orders**.
- [ ] `php artisan test` (from `backend/`) — the full Pest suite should
      pass.

## 9. Troubleshooting

| Problem | Likely cause |
|---|---|
| `SQLSTATE[HY000] [1045] Access denied` | Check `DB_USERNAME`/`DB_PASSWORD` in `backend/.env` match what you created in [§3](#3-database-setup) |
| `Class "PHPOpenSourceSaver\JWTAuth\..." not found` | Run `composer install` again from `backend/` |
| Admin image upload fails with a Cloudinary error | Double-check the three `CLOUDINARY_*` values in `backend/.env` — see [§5](#5-cloudinary-setup) |
| Frontend shows network errors on every page | Confirm the backend is actually running (`php artisan serve`) and `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` matches its address |
| `419` / CORS errors calling the API from the browser | Check `config/cors.php` and `FRONTEND_URL` in `backend/.env` match where your frontend is actually running |
| Migrations fail partway through | Run `php artisan migrate:fresh --seed` to drop and recreate every table cleanly (⚠️ destroys existing data — only for local development) |
| `npm run dev` fails on a missing module | Delete `frontend/node_modules` and `frontend/package-lock.json`, then `npm install` again |

Still stuck? Check `backend/storage/logs/laravel.log` for the backend's own
detailed error trace — it's almost always more specific than what the
frontend shows.
