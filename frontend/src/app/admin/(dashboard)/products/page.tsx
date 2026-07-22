"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/collections/pagination";
import { ProductFiltersBar } from "@/components/admin/products/product-filters";
import { ProductTable } from "@/components/admin/products/product-table";
import { BulkActionsBar } from "@/components/admin/products/bulk-actions-bar";
import { useProductList, useDeleteProduct, useDuplicateProduct, useBulkProductAction } from "@/hooks/admin/use-admin-products";
import { ROUTES } from "@/constants/routes";
import type { ProductListFilters, BulkProductAction } from "@/types/admin/product";

const PER_PAGE = 20;

export default function AdminProductsPage() {
  const [filters, setFilters] = useState<ProductListFilters>({ sort: "newest", page: 1 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading } = useProductList({ ...filters, perPage: PER_PAGE });
  const deleteProduct = useDeleteProduct();
  const duplicateProduct = useDuplicateProduct();
  const bulkAction = useBulkProductAction();

  const products = data?.items ?? [];

  function updateFilters(patch: Partial<ProductListFilters>) {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
    setSelectedIds([]);
  }

  function toggleSelect(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleSelectAll() {
    setSelectedIds((current) => (current.length === products.length ? [] : products.map((product) => product.id)));
  }

  function handleDelete(id: number) {
    if (!window.confirm("Delete this product? This also removes its uploaded images.")) return;
    deleteProduct.mutate(id);
  }

  function handleBulkAction(action: BulkProductAction, categoryId?: number) {
    if (action === "delete" && !window.confirm(`Delete ${selectedIds.length} product(s)? This can't be undone.`)) {
      return;
    }
    bulkAction.mutate(
      { ids: selectedIds, action, categoryId },
      { onSuccess: () => setSelectedIds([]) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-light text-foreground">Products</h1>
          <p className="text-body-sm text-muted-foreground">
            {data?.meta.total ?? "…"} product{data?.meta.total === 1 ? "" : "s"} in the catalog.
          </p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href={ROUTES.admin.productNew}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductFiltersBar filters={filters} onChange={updateFilters} />

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onAction={handleBulkAction}
        onClearSelection={() => setSelectedIds([])}
        isPending={bulkAction.isPending}
      />

      <ProductTable
        products={products}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        sort={filters.sort}
        onSortChange={(sort) => updateFilters({ sort })}
        onDuplicate={(id) => duplicateProduct.mutate(id)}
        onDelete={handleDelete}
      />

      {data && data.meta.lastPage > 1 ? (
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.lastPage}
          onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        />
      ) : null}
    </div>
  );
}
