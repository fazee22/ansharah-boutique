import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { primaryNav } from "@/constants/navigation";
import { productsService } from "@/services/api/products.service";
import { findNodesByIdPath } from "@/lib/nav-tree";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/collections/breadcrumbs";
import { ProductMedia } from "@/components/products/product-media";
import { ProductInfo } from "@/components/products/product-info";
import { ProductActions } from "@/components/products/product-actions";
import { ProductTabs } from "@/components/products/product-tabs";
import { ReviewsSection } from "@/components/products/reviews-section";
import { ProductRow } from "@/components/products/product-row";
import { RecentlyViewedRow } from "@/components/products/recently-viewed-row";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import { env } from "@/config/env";
import { ROUTES } from "@/constants/routes";

const collectionsNode = primaryNav.find((item) => item.id === "collections");

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productsService.getBySlug(slug);
  if (!product) return {};

  const title = product.name;
  const description = product.shortDescription;
  const url = `${env.app.url}${ROUTES.product(product.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: env.app.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productsService.getBySlug(slug);
  if (!product) notFound();

  const categoryNodes = collectionsNode?.children
    ? findNodesByIdPath(collectionsNode.children, product.categoryPath)
    : [];
  const breadcrumbItems = [
    ...categoryNodes.map((node) => ({ label: node.label, href: node.href })),
    { label: product.name },
  ];

  const sameCategory = await productsService.list({ category: product.categoryPath.at(-1), perPage: 9 });
  const otherProducts = sameCategory.filter((item) => item.id !== product.id);
  const relatedProducts = otherProducts.slice(0, 4);
  const youMayAlsoLike = otherProducts.slice(4, 8);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: env.app.url },
    ...categoryNodes.map((node) => ({ name: node.label, url: `${env.app.url}${node.href}` })),
    { name: product.name, url: `${env.app.url}${ROUTES.product(product.slug)}` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    category: product.categoryLabels.join(" > "),
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.price,
      priceCurrency: product.currency,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${env.app.url}${ROUTES.product(product.slug)}`,
    },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Container className="flex flex-col gap-12 py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductMedia images={product.images} productName={product.name} />
          <div className="flex flex-col gap-8">
            <ProductInfo product={product} />
            <ProductActions product={product} />
          </div>
        </div>

        <ProductTabs product={product} />

        <ReviewsSection productId={product.id} />
      </Container>

      <ProductRow eyebrow="Similar Pieces" title="Related Products" products={relatedProducts} />
      <ProductRow eyebrow="Curated For You" title="You May Also Like" products={youMayAlsoLike} />
      <RecentlyViewedRow currentProductId={product.id} />
    </>
  );
}