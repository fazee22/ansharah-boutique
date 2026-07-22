"use client";

import { useMemo, useState } from "react";
import type { Product, SortOption } from "@/types/product";
import { filterProducts, sortProducts, paginateProducts, type ProductFilters as Filters } from "@/lib/products";

export const DEFAULT_PER_PAGE = 12;

export interface UseProductFiltersOptions {
  perPage?: number;
}

/**
 * Owns all filter/sort/pagination state for a collection page and
 * derives the visible product page from it via `useMemo` — the
 * source array (`baseProducts`, already scoped to the current
 * collection node) never mutates; every derived list is recomputed,
 * never stored, so filters/sort/page can never drift out of sync
 * with each other.
 *
 * Changing any filter or the sort order resets to page 1, since the
 * previous page number is almost never still meaningful against a
 * different result set.
 */
export function useProductFilters(baseProducts: Product[], options: UseProductFiltersOptions = {}) {
  const perPage = options.perPage ?? DEFAULT_PER_PAGE;

  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const updateFilters = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const changeSort = (value: SortOption) => {
    setSortBy(value);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const filteredSorted = useMemo(
    () => sortProducts(filterProducts(baseProducts, filters), sortBy),
    [baseProducts, filters, sortBy],
  );

  const paginated = useMemo(
    () => paginateProducts(filteredSorted, page, perPage),
    [filteredSorted, page, perPage],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.collectionIds?.length) count += filters.collectionIds.length;
    if (filters.pieceTypeLabels?.length) count += filters.pieceTypeLabels.length;
if (filters.fabricLabels?.length) count += filters.fabricLabels.length;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count += 1;
    if (filters.inStockOnly) count += 1;
    if (filters.isNew) count += 1;
    if (filters.isFeatured) count += 1;
    if (filters.isSale) count += 1;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    sortBy,
    changeSort,
    page,
    setPage,
    activeFilterCount,
    result: paginated,
    totalUnfiltered: baseProducts.length,
  };
}
