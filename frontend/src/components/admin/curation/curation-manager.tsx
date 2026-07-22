"use client";

import { useState } from "react";
import { GripVertical, X, ImageOff, Star } from "lucide-react";
import { ProductPicker } from "./product-picker";
import { useCurationList, useAddToCuration, useRemoveFromCuration, useReorderCuration } from "@/hooks/admin/use-admin-curation";
import { useUpdateProduct } from "@/hooks/admin/use-admin-products";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CurationType } from "@/services/api/admin/curation.service";

export interface CurationManagerProps {
  type: CurationType;
  emptyMessage: string;
}

/**
 * Add / Remove / Reorder / Feature — the exact four verbs the brief
 * lists for both the New Arrivals Manager and the Sale Manager.
 * "Feature" reuses the existing `is_featured` flag from Phase 6's
 * product form (`useUpdateProduct`) rather than inventing a second,
 * curation-specific featured flag.
 */
function CurationManager({ type, emptyMessage }: CurationManagerProps) {
  const { data: products, isLoading } = useCurationList(type);
  const add = useAddToCuration(type);
  const remove = useRemoveFromCuration(type);
  const reorder = useReorderCuration(type);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const sorted = [...(products ?? [])].sort((a, b) => {
    const posA = (type === "new_arrivals" ? a.newArrivalPosition : a.salePosition) ?? 0;
    const posB = (type === "new_arrivals" ? b.newArrivalPosition : b.salePosition) ?? 0;
    return posA - posB;
  });

  function handleDrop(targetId: number) {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const reordered = [...sorted];
    const fromIndex = reordered.findIndex((p) => p.id === draggedId);
    const toIndex = reordered.findIndex((p) => p.id === targetId);
    const [moved] = reordered.splice(fromIndex, 1);
    if (moved) reordered.splice(toIndex, 0, moved);
    reorder.mutate(reordered.map((p, index) => ({ id: p.id, position: index + 1 })));
    setDraggedId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-2 rounded-lg border border-hairline bg-card p-4">
        {isLoading ? (
          <p className="py-6 text-center text-caption text-muted-foreground">Loading…</p>
        ) : sorted.length === 0 ? (
          <p className="py-10 text-center text-body-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          sorted.map((product) => {
            const image = product.images[0];
            return (
              <div
                key={product.id}
                draggable
                onDragStart={() => setDraggedId(product.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(product.id)}
                className={cn(
                  "flex items-center gap-3 rounded-md border border-hairline p-3",
                  draggedId === product.id && "opacity-40",
                )}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing" aria-hidden="true" />
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone/40 text-muted-foreground">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-only curation preview thumbnail
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-body-sm text-ink">{product.name}</span>
                  <span className="font-mono text-caption text-muted-foreground">
                    {formatCurrency(product.salePrice ?? product.price)}
                  </span>
                </div>
                <FeatureToggle productId={product.id} isFeatured={product.isFeatured} />
                <button
                  type="button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => remove.mutate(product.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <ProductPicker onAdd={(productId) => add.mutate(productId)} excludeIds={sorted.map((p) => p.id)} />
    </div>
  );
}

function FeatureToggle({ productId, isFeatured }: { productId: number; isFeatured: boolean }) {
  const updateProduct = useUpdateProduct();

  return (
    <button
      type="button"
      aria-label={isFeatured ? "Remove from Featured" : "Mark as Featured"}
      aria-pressed={isFeatured}
      onClick={() => updateProduct.mutate({ id: productId, values: { isFeatured: !isFeatured } })}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-brass/10 hover:text-brass-dark"
    >
      <Star className={cn("h-4 w-4", isFeatured && "fill-brass-dark text-brass-dark")} aria-hidden="true" />
    </button>
  );
}

export { CurationManager };
