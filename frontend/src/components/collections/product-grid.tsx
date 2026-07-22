"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { EmptyState } from "./empty-state";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { Product } from "@/types/product";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  onQuickView?: (product: Product) => void;
  onClearFilters?: () => void;
  /** Overrides the default "no pieces match your filters" empty state — used by Search (Phase 8), which needs copy referencing the actual search term. */
  emptyState?: ReactNode;
}

/**
 * The catalog's one reusable product grid: 4 columns desktop, 2
 * tablet, 1 mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
 * Every collection/search/preview surface renders products through
 * this component rather than laying out its own grid, so the
 * responsive breakpoints and luxury gutter spacing can never drift
 * between pages.
 */
function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  onQuickView,
  onClearFilters,
  emptyState,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return emptyState ? <>{emptyState}</> : <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.05)}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={fadeUp}>
          <ProductCard product={product} onQuickView={onQuickView} priority={index < 4} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export { ProductGrid };
