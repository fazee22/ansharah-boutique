"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useProductList } from "@/hooks/admin/use-admin-products";
import { formatCurrency } from "@/lib/format";

export interface ProductPickerProps {
  onAdd: (productId: number) => void;
  /** Ids already in the curated list — shown as "Added" instead of a pickable "+" button. */
  excludeIds: number[];
}

/**
 * Live search over the full product catalog for adding items to a
 * curated list (New Arrivals / Sale). Deliberately searches
 * everything, not just already-flagged products — that's the whole
 * point of an "Add" picker.
 */
function ProductPicker({ onAdd, excludeIds }: ProductPickerProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useProductList({ search, status: "published", perPage: 8 });

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-hairline bg-card p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products to add…"
          className="h-10 w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      {search.trim() ? (
        <ul className="flex max-h-72 flex-col divide-y divide-hairline overflow-y-auto">
          {isLoading ? (
            <li className="py-4 text-center text-caption text-muted-foreground">Searching…</li>
          ) : data && data.items.length > 0 ? (
            data.items.map((product) => {
              const alreadyAdded = excludeIds.includes(product.id);
              return (
                <li key={product.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-body-sm text-ink">{product.name}</span>
                    <span className="font-mono text-caption text-muted-foreground">
                      {formatCurrency(product.salePrice ?? product.price)}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => onAdd(product.id)}
                    className="flex shrink-0 items-center gap-1 rounded-md border border-hairline px-2.5 py-1.5 text-caption text-ink transition-colors hover:border-brass hover:text-brass-dark disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    {alreadyAdded ? "Added" : "Add"}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="py-4 text-center text-caption text-muted-foreground">No products found.</li>
          )}
        </ul>
      ) : (
        <p className="py-2 text-center text-caption text-muted-foreground">Type to search the catalog.</p>
      )}
    </div>
  );
}

export { ProductPicker };
