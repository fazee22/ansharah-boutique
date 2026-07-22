# Admin Guide

A guide to running your store day-to-day from the admin dashboard — written
for the store owner/operator, not a developer. For technical setup, see
[INSTALLATION.md](./INSTALLATION.md) or [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Signing In

Go to `/admin/login` (e.g. `https://yourdomain.com/admin/login`) and sign
in with your admin email and password. Check **Remember Login** to stay
signed in on that device for up to two weeks; leave it unchecked on a
shared/public computer.

Only accounts with the **Admin** or **Super Admin** role can access this
dashboard — a customer account will be rejected here even with correct
credentials.

## Dashboard Overview

The homepage of the admin panel shows, at a glance: total/published
products, categories, low-stock and out-of-stock counts, total orders,
total customers, and revenue from paid orders — all real numbers, updated
live. Below that: your most recent orders, your best-selling products
(ranked by actual units sold), and a low-stock alert list so nothing runs
out unnoticed.

Use the **Quick Actions** panel to jump straight to adding a product or
category without navigating the sidebar.

## Managing Products

**Products → Add Product** (or edit an existing one):

1. Fill in the name, SKU, price, and (optionally) a sale price — a sale
   price must be lower than the regular price.
2. Choose a **Category** — this determines which collection page on the
   storefront it belongs to.
3. Set **Status**: Draft (not visible anywhere), Published (live), or
   Hidden (was published, temporarily pulled).
4. Toggle **Featured**, **New Arrival**, and **Sale** as needed — these
   control which curated homepage sections a product appears in (see
   "New Arrivals & Sale" below for finer control over ordering).
5. **Save the product first**, then the **Images** section becomes
   available — images attach to a real, saved product record.

**Adding images**: drag image files directly onto the upload area, or
click it to browse. JPEG, PNG, or WebP, up to 8MB each. Aim for at least
4 images per product — the storefront gallery is designed around that
minimum, though there's no hard limit above it. Drag any image thumbnail
to reorder it; hover an image and click the star icon to set it as the
featured (primary) image, or the trash icon to delete it — you can't
delete a product's last remaining image without first adding a
replacement.

**Bulk actions**: select multiple products in the list (checkbox on the
left of each row) to publish, draft, hide, delete, or move them to a
different category all at once.

## Managing Categories & Collections

**Categories & Collections** is one screen, one tree — "Collections" (like
Summer Collection, Winter Collection, Shawls) are just the top level of the
same tree that "Categories" (like Embroidered Lawn, Khaddar) live inside.
Click **Add Collection** for a top-level entry, or the **+** icon on any
row to add a subcategory beneath it.

Drag any row to reorder it among its siblings. The eye icon toggles
whether it's visible on the storefront. You can't delete a category that
still has subcategories or products in it — reassign or remove those
first.

## Orders

**Orders** lists every order with search, status/payment filters, and
sorting. Open any order to see its full detail: items, customer info,
shipping address, and the **Order Timeline** — a running log of every
status change, including the note recorded automatically when a payment
succeeds.

**Changing status**: pick a new status from the dropdown, optionally add a
note (e.g. a tracking number), and save. This is logged permanently and is
what powers the customer's own Order Tracking view on their side.

**Print Invoice**: opens your browser's print dialog with a clean,
site-branded invoice (no admin menus/sidebar) — use "Save as PDF" as your
print destination if you want a file instead of a physical printout.

**Order Notes** (separate from the Timeline) are for internal context —
"customer asked to delay shipping," etc. — not shown to the customer.

## Customers

**Customers** lists every registered account, with lifetime order count
and account status. Open a customer to see their saved addresses, notes,
and lifetime stats (total orders, total spent on paid orders, last order
date). **Block Account** prevents further logins without deleting their
data or order history.

## Homepage, Hero Banner & Auto Moving Slider

- **Content → Homepage**: toggle entire homepage sections on or off
  (Featured Collections, New Arrivals, Sale, Newsletter, Instagram) — a
  toggle turned off disappears from the live site within a few minutes.
- **Content → Hero Banner**: the large rotating banner at the top of the
  homepage. Upload images the same drag-and-drop way as product images;
  each slide can have its own title, subtitle, link, and button label.
- **Content → Auto Moving Slider**: the continuously scrolling strip
  further down the homepage. Upload images the same way, then use the
  panel on the right to control exactly how it moves — speed, direction,
  whether it pauses when hovered, and whether mobile visitors can swipe it.

## New Arrivals & Sale

Both work the same way: search the catalog on the right to add a product,
drag entries on the left to control the order they appear in on the
storefront, and click the star icon to also mark one as **Featured**. The
**Sale** page additionally lets you edit the sale banner's headline,
subtext, default discount percentage, and an optional countdown timer.

## WhatsApp, Website & SEO Settings

**Settings** has three tabs:

- **Website** — your site name, logo/favicon URLs, footer text, contact
  email/phone/address, social media links, and copyright text.
- **WhatsApp** — your real WhatsApp number, the default pre-filled
  message, and independent toggles for the floating chat button (visible
  site-wide) versus the "Order on WhatsApp" button (on product pages).
- **SEO** — the default meta title/description used when a page doesn't
  set its own, keywords, Open Graph image, Twitter card type, and whether
  search engines are allowed to index the site at all.

Every field here is real and live — changes typically appear on the
storefront within about 5 minutes (or immediately after a hard refresh).

## Newsletter

**Newsletter** lists everyone who's subscribed via the storefront's footer
or homepage forms, with search, individual removal, and a one-click CSV
export for use with your email marketing tool of choice.

## Dark Mode

Toggle light/dark mode for the admin dashboard itself from the sun/moon
icon in the top bar — this is purely an admin-panel preference and never
affects how the storefront looks to customers.

## Signing Out

Click the sign-out icon in the top bar. This clears your session on that
device; if you checked Remember Login elsewhere, that device stays signed
in until you sign out there too or the two-week window elapses.
