"use client";

import { useState } from "react";
import { FiltersPanel, type FilterVisibility } from "./filters-panel";
import { FiltersMobile } from "./filters-mobile";
import { SortDropdown } from "./sort-dropdown";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-grid";
import { QuickViewDialog } from "./quick-view-dialog";
import { useProductFilters } from "@/hooks/use-product-filters";
import type { Product } from "@/types/product";

export interface CollectionExplorerProps {
  products: Product[];
  filterVisibility: FilterVisibility;
}

/**
 * The interactive core of every collection page: filters (sidebar +
 * mobile sheet), sort, the product grid, and pagination, all wired
 * together through `useProductFilters`. Receives an already-scoped
 * `products` array (the parent Server Component resolved which nav
 * node the URL points at and called `getProductsForNode`) — this
 * component only ever filters/sorts/paginates *within* that scope,
 * it never re-fetches or re-scopes by category itself.
 */
function CollectionExplorer({ products, filterVisibility }: CollectionExplorerProps) {
  const { filters, updateFilters, resetFilters, sortBy, changeSort, page, setPage, activeFilterCount, result } =
    useProductFilters(products);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <FiltersPanel
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          visibility={filterVisibility}
          activeFilterCount={activeFilterCount}
        />
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FiltersMobile
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            visibility={filterVisibility}
            activeFilterCount={activeFilterCount}
          />
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-caption text-muted-foreground sm:inline">
              {result.totalItems} {result.totalItems === 1 ? "result" : "results"}
            </span>
            <SortDropdown value={sortBy} onChange={changeSort} />
          </div>
        </div>

        <ProductGrid
          products={result.items}
          onQuickView={setQuickViewProduct}
          onClearFilters={resetFilters}
        />

        <div className="pt-4">
          <Pagination currentPage={result.currentPage} totalPages={result.totalPages} onPageChange={setPage} />
        </div>
      </div>

      <QuickViewDialog product={quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)} />
    </div>
  );
}

export { CollectionExplorer };
