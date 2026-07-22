import type { MetadataRoute } from "next";
import { primaryNav } from "@/constants/navigation";
import { collectAllPaths } from "@/lib/nav-tree";
import { mockProducts } from "@/lib/mock/products";
import { env } from "@/config/env";

const collectionsNode = primaryNav.find((item) => item.id === "collections");

/**
 * Next.js's `sitemap.ts` file convention — visiting `/sitemap.xml`
 * renders this as real XML, no separate build step. Covers every
 * static page, every collection/category path (from the same
 * `collectAllPaths` the collection route itself uses for
 * `generateStaticParams`, so the two can never drift), and every
 * product in the mock catalog. Will need to swap `mockProducts` for a
 * real product query once the storefront moves off mock data (Phase
 * 6/7 scope decision) — everything else here stays the same shape.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.app.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/collections`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/sale`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faqs`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms-conditions`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/returns`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/shipping`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collectAllPaths(collectionsNode?.children ?? []).map((slug) => ({
    url: `${baseUrl}/collections/${slug.join("/")}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = mockProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
    lastModified: product.createdAt,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
