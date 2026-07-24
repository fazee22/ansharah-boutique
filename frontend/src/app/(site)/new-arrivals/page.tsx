import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { CollectionHero } from "@/components/collections/collection-hero";
import { CollectionExplorer } from "@/components/collections/collection-explorer";
import { productsService } from "@/services/api/products.service";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The newest pieces across every collection, previewed first.",
};

export default async function NewArrivalsPage() {
  const products = await productsService.list({ newArrivals: true });

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <CollectionHero
        title="New Arrivals"
        description="The newest edits, previewed first for those who look early."
        breadcrumbItems={[{ label: "New Arrivals", href: ROUTES.newArrivals }]}
        productCount={products.length}
      />
      <CollectionExplorer
        products={products}
        filterVisibility={{ collection: true, pieceType: true, fabric: true }}
      />
    </Container>
  );
}