"use client";

import { useState } from "react";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { ProductCard } from "@/components/collections/product-card";
import { QuickViewDialog } from "@/components/collections/quick-view-dialog";
import type { Product } from "@/types/product";

export interface ProductRowProps {
  title: string;
  eyebrow?: string;
  products: Product[];
}

/**
 * One reusable horizontal product row, used identically by "Related
 * Products," "You May Also Like," and "Recently Viewed" on the
 * product detail page — only the title and the product list differ
 * per usage. Renders nothing if `products` is empty (e.g. Recently
 * Viewed before a second product has ever been visited), rather than
 * showing an empty section.
 */
function ProductRow({ title, eyebrow, products }: ProductRowProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) return null;

  return (
    <Section tone="canvas" spacing="md">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
        ))}
      </div>
      <QuickViewDialog product={quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)} />
    </Section>
  );
}

export { ProductRow };
