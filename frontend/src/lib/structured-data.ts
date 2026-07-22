import { siteConfig } from "@/config/site";
import { env } from "@/config/env";

/**
 * JSON-LD builders — each returns a plain object meant to be
 * `JSON.stringify`'d into a `<script type="application/ld+json">` tag
 * (see `(site)/layout.tsx` for Organization/WebSite, and the product
 * detail page — Phase 5 — for the existing Product schema this file
 * doesn't duplicate).
 */

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: env.app.url,
    description: siteConfig.seo.defaultDescription,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: env.app.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${env.app.url.replace(/\/$/, "")}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
