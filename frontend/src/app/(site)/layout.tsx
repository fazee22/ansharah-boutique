import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/shared/whatsapp-floating-button";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/structured-data";

/**
 * Storefront chrome (header, footer, skip-to-content link) — applies
 * to every route under `(site)` (which is every public-facing page:
 * home, collections, products, search, cart, etc.), never to
 * `admin/*`, which has its own layout entirely. Moved here from the
 * root layout in Phase 6 to make that split possible.
 *
 * Also renders site-wide Organization + WebSite JSON-LD once here
 * (Phase 9) rather than per-page — both describe the site itself, not
 * any individual page, so one inclusion covers every route in this
 * group. Page-specific structured data (Product — Phase 5,
 * BreadcrumbList) lives on the pages it describes.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, code-generated JSON-LD, never user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, code-generated JSON-LD, never user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteSchema()) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-porcelain"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
