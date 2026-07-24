import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { primaryNav } from "@/constants/navigation";
import { resolveNodePath, collectAllPaths } from "@/lib/nav-tree";
import { productsService } from "@/services/api/products.service";
import { categoriesService } from "@/services/api/categories.service";
import { buildCategoryImageMap } from "@/lib/build-category-image-map";
import { computeFilterVisibility } from "@/lib/collection-filter-visibility";
import { CollectionHero } from "@/components/collections/collection-hero";
import { CollectionSubcategories } from "@/components/collections/collection-subcategories";
import { CollectionExplorer } from "@/components/collections/collection-explorer";
import { Container } from "@/components/shared/container";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { env } from "@/config/env";

const collectionsNode = primaryNav.find((item) => item.id === "collections");

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function resolve(slug: string[]) {
  if (!collectionsNode?.children) return null;
  return resolveNodePath(collectionsNode.children, slug);
}
/**
 * Pre-renders every collection/category page at build time — Summer
 * Collection, Winter Collection, 2 Piece, 3 Piece, Embroidered Lawn,
 * Printed Lawn, Marina, Linen, Viscose, Winter Karandi, Khaddar,
 * Embroidered Shawls, Printed Shawls, and every intermediate node —
 * from ONE dynamic route rather than 13+ hand-written page files.
 * The tree is small and fully known at build time, so static
 * generation beats on-demand rendering for both SEO and speed.
 */
export function generateStaticParams() {
  if (!collectionsNode?.children) return [];
  return collectAllPaths(collectionsNode.children).map((slug) => ({ slug }));
}
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolve(slug);
  if (!resolved) return {};

  const { node, ancestors } = resolved;
  const trail = [...ancestors, node].map((item) => item.label).join(" — ");
  const title = node.label;
  const description = `Shop the ${trail} edit — considered luxury pieces, curated by category.`;
  const url = `${env.app.url}${node.href}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: env.app.name },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolve(slug);
  if (!resolved) notFound();

  const { node, ancestors } = resolved;
 const categoryPath = (node.href?.split("/").filter(Boolean) ?? []).filter((segment) => segment !== "collections");
const categorySlug = categoryPath.join("-");
const [products, categories] = await Promise.all([
  productsService.list({ category: categorySlug }),
  categoriesService.tree(),
]);
const imageMap = buildCategoryImageMap(categories);
  const breadcrumbItems = [...ancestors, node].map((item) => ({ label: item.label, href: item.href }));
  const visibility = computeFilterVisibility(node);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: env.app.url },
    ...breadcrumbItems.map((item) => ({ name: item.label, url: `${env.app.url}${item.href}` })),
  ]);

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CollectionHero
        title={node.label}
        breadcrumbItems={breadcrumbItems}
        productCount={products.length}
      />

      <CollectionSubcategories items={node.children ?? []} imageMap={imageMap} />

      <CollectionExplorer products={products} filterVisibility={visibility} />
    </Container>
  );
}
