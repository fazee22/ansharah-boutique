import type { Metadata } from "next";
import { primaryNav } from "@/constants/navigation";
import { collectAllLeaves } from "@/lib/nav-tree";
import { productsService } from "@/services/api/products.service";
import { categoriesService } from "@/services/api/categories.service";
import { buildCategoryImageMap } from "@/lib/build-category-image-map";
import { computeFilterVisibility } from "@/lib/collection-filter-visibility";
import { CollectionHero } from "@/components/collections/collection-hero";
import { CollectionSubcategories } from "@/components/collections/collection-subcategories";
import { CollectionExplorer } from "@/components/collections/collection-explorer";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse every collection — Summer, Winter, and the Shawl edit — in one place.",
};

const collectionsNode = primaryNav.find((item) => item.id === "collections");

export default async function CollectionsIndexPage() {
  const topLevel = collectionsNode?.children ?? [];
  const allLeafCount = collectAllLeaves(topLevel).length;
  const [products, categories] = await Promise.all([productsService.list({}), categoriesService.tree()]);
  const imageMap = buildCategoryImageMap(categories);

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <CollectionHero
        title="All Collections"
        description="Every edit, in one place — from lawn two-pieces to embroidered shawls."
        breadcrumbItems={[]}
        productCount={products.length}
      />

      <CollectionSubcategories items={topLevel} imageMap={imageMap} />

      {allLeafCount > 0 ? (
        <CollectionExplorer products={products} filterVisibility={computeFilterVisibility(null)} />
      ) : null}
    </Container>
  );
}