"use client";

import { Search } from "lucide-react";
import { CategorySelect } from "./category-select";
import type { AdminProductStatus, ProductListFilters } from "@/types/admin/product";

export interface ProductFiltersBarProps {
  filters: ProductListFilters;
  onChange: (patch: Partial<ProductListFilters>) => void;
}

const STATUS_OPTIONS: { value: AdminProductStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "hidden", label: "Hidden" },
];

/**
 * Live filter bar for the product table — every change here updates
 * the parent's filter state directly (no separate "Apply" step),
 * which `useProductList` (backed by React Query) then refetches
 * against. Search is genuinely live: no debounce needed since it's a
 * real network request either way and React Query dedupes/cancels
 * stale ones automatically.
 */
function ProductFiltersBar({ filters, onChange }: ProductFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[240px] sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={filters.search ?? ""}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by name or SKU…"
          className="h-11 w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <select
        value={filters.status ?? ""}
        onChange={(event) => onChange({ status: (event.target.value || undefined) as AdminProductStatus | undefined })}
        className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <CategorySelect
        value={filters.categoryId ?? null}
        onChange={(categoryId) => onChange({ categoryId })}
        allowAll
        className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      />

      <label className="flex h-11 items-center gap-2 rounded-md border border-hairline px-3 text-body-sm text-ink">
        <input
          type="checkbox"
          checked={Boolean(filters.featured)}
          onChange={(event) => onChange({ featured: event.target.checked || undefined })}
          className="h-4 w-4 accent-brass"
        />
        Featured
      </label>

      <label className="flex h-11 items-center gap-2 rounded-md border border-hairline px-3 text-body-sm text-ink">
        <input
          type="checkbox"
          checked={Boolean(filters.sale)}
          onChange={(event) => onChange({ sale: event.target.checked || undefined })}
          className="h-4 w-4 accent-brass"
        />
        On Sale
      </label>
    </div>
  );
}

export { ProductFiltersBar };
