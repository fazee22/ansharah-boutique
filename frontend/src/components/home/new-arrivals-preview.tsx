"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/collections/product-card";
import { QuickViewDialog } from "@/components/collections/quick-view-dialog";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useNewArrivals } from "@/hooks/use-new-arrivals";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/product";

function NewArrivalsPreview() {
  const { data: newArrivals } = useNewArrivals(4);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);


  return (
    <Section tone="canvas" spacing="lg">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionTitle
          eyebrow="Just In"
          title="New Arrivals"
          description="The newest edits, previewed first for those who look early."
        />
        <Button asChild variant="outline" size="md" className="shrink-0">
          <Link href={ROUTES.newArrivals}>
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px 0px" }}
        variants={staggerContainer(0.1)}
        className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {(newArrivals ?? []).map((product, index) => (
          <motion.div key={product.id} variants={fadeUp}>
            <ProductCard product={product} onQuickView={setQuickViewProduct} priority={index < 4} />
          </motion.div>
        ))}
      </motion.div>

      <QuickViewDialog product={quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)} />
    </Section>
  );
}

export { NewArrivalsPreview };
