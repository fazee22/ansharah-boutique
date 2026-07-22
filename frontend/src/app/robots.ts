import type { MetadataRoute } from "next";
import { env } from "@/config/env";

/**
 * Next.js's `robots.ts` file convention — visiting `/robots.txt`
 * renders this as real plain text. Disallows the admin dashboard and
 * account pages (nothing there should be indexed) and points crawlers
 * at the dynamic sitemap (`app/sitemap.ts`).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.app.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/api", "/maintenance", "/login", "/register", "/cart"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
