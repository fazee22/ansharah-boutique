"use client";

import Link from "next/link";
import { ImageOff, Copy, Trash2, Pencil, ArrowUpDown } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { AdminProduct, AdminProductStatus, ProductListFilters } from "@/types/admin/product";

export interface ProductTableProps {
  products: AdminProduct[];
  isLoading: boolean;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  sort: ProductListFilters["sort"];
  onSortChange: (sort: NonNullable<ProductListFilters["sort"]>) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
}

const STATUS_BADGE: Record<AdminProductStatus, { label: string; variant: "brass" | "outline" | "ink" }> = {
  published: { label: "Published", variant: "brass" },
  draft: { label: "Draft", variant: "outline" },
  hidden: { label: "Hidden", variant: "ink" },
};

function SortableHead({
  label,
  sortKey,
  currentSort,
  onSortChange,
}: {
  label: string;
  sortKey: NonNullable<ProductListFilters["sort"]>;
  currentSort: ProductListFilters["sort"];
  onSortChange: (sort: NonNullable<ProductListFilters["sort"]>) => void;
}) {
  const isActive = currentSort === sortKey;
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSortChange(sortKey)}
        className={cn(
          "flex items-center gap-1 transition-colors hover:text-ink",
          isActive && "text-brass-dark",
        )}
      >
        {label}
        <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
      </button>
    </TableHead>
  );
}

/**
 * The product management data table: sortable headers, row
 * selection (backing the bulk-actions bar), status/stock badges, and
 * per-row Edit/Duplicate/Delete actions. Pagination is handled by the
 * parent page via the same `Pagination` component the storefront's
 * collection pages use (Phase 4) — one reusable component, admin and
 * storefront alike.
 */
function ProductTable({
  products,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sort,
  onSortChange,
  onDuplicate,
  onDelete,
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={someSelected ? "indeterminate" : allSelected}
              onCheckedChange={onToggleSelectAll}
              aria-label="Select all products on this page"
            />
          </TableHead>
          <TableHead>Product</TableHead>
          <SortableHead label="Price" sortKey="price_asc" currentSort={sort} onSortChange={onSortChange} />
          <SortableHead label="Stock" sortKey="stock" currentSort={sort} onSortChange={onSortChange} />
          <TableHead>Status</TableHead>
          <TableHead>Category</TableHead>
          <SortableHead label="Updated" sortKey="newest" currentSort={sort} onSortChange={onSortChange} />
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
              Loading products…
            </TableCell>
          </TableRow>
        ) : products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
              No products match your filters.
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => {
            const image = product.images[0];
            const status = STATUS_BADGE[product.status];
            return (
              <TableRow key={product.id} data-state={selectedIds.includes(product.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => onToggleSelect(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  <Link href={ROUTES.admin.productEdit(product.id)} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone/40 text-muted-foreground">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail preview
                        <img src={image.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-body-sm text-ink hover:text-brass-dark">{product.name}</span>
                      <span className="font-mono text-caption text-muted-foreground">{product.sku}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="font-mono">
                  {product.salePrice ? (
                    <span className="flex flex-col">
                      <span className="text-brass-dark">{formatCurrency(product.salePrice)}</span>
                      <span className="text-caption text-muted-foreground line-through">
                        {formatCurrency(product.price)}
                      </span>
                    </span>
                  ) : (
                    formatCurrency(product.price)
                  )}
                </TableCell>
                <TableCell className="font-mono">
                  <span className={product.stockQuantity <= 5 ? "text-destructive" : undefined}>
                    {product.stockQuantity}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell className="text-caption text-muted-foreground">
                  {product.category?.name ?? "—"}
                </TableCell>
                <TableCell className="text-caption text-muted-foreground">
                  {formatDate(product.updatedAt, { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={ROUTES.admin.productEdit(product.id)}
                      aria-label={`Edit ${product.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5 hover:text-ink"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Duplicate ${product.name}`}
                      onClick={() => onDuplicate(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5 hover:text-ink"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => onDelete(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

export { ProductTable };
