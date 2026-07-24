import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { CollectionHero } from "@/components/collections/collection-hero";
import { CollectionExplorer } from "@/components/collections/collection-explorer";
import { productsService } from "@/services/api/products.service";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sale",
  description: "Considered reductions across the catalog, while they last.",
};

export default async function SalePage() {
  const products = await productsService.list({ sale: true });

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <CollectionHero
        title="Sale"
        description="A considered edit of reduced pieces — once they're gone, they're gone."
        breadcrumbItems={[{ label: "Sale", href: ROUTES.sale }]}
        productCount={products.length}
      />
      <CollectionExplorer
        products={products}
        filterVisibility={{ collection: true, pieceType: true, fabric: true }}
      />
    </Container>
  );
}