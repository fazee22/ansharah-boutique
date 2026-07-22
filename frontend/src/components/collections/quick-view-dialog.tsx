"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatCurrency } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export interface QuickViewDialogProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Lightweight product preview triggered from a `ProductCard`'s Quick
 * View button — deliberately NOT the full product detail page (that
 * is explicitly out of scope for Phase 4). Shows the primary image
 * and essentials only; "View Full Details" links to the product
 * page, which doesn't exist until Phase 5 — consistent with this
 * project's established pattern of wiring links ahead of the pages
 * they'll eventually resolve to.
 */
function QuickViewDialog({ product, onOpenChange }: QuickViewDialogProps) {
  // Radix's close-transition CSS (`data-[state=closed]:animate-...`)
  // only plays if `DialogContent` stays mounted while it runs — if we
  // conditionally rendered `{product ? <DialogContent/> : null}`,
  // React would rip the node out the instant `product` goes `null`,
  // before any exit animation could play. Retaining the last product
  // here keeps the content mounted (with valid data) through the
  // close transition; `open` still controls actual visibility.
  const [displayProduct, setDisplayProduct] = useState<Product | null>(null);
  if (product && product !== displayProduct) setDisplayProduct(product);

  const isWishlisted = useWishlistStore((state) =>
    displayProduct ? state.isWishlisted(displayProduct.id) : false,
  );
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      {displayProduct ? (
        <DialogContent title={`Quick view — ${displayProduct.name}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {displayProduct.images[0]?.url ? (
  // eslint-disable-next-line @next/next/no-img-element -- real, admin-uploaded product photo
  <img
    src={displayProduct.images[0].url}
    alt={displayProduct.images[0].alt ?? displayProduct.name}
    className="aspect-[3/4] w-full rounded-l-lg object-cover sm:rounded-l-lg sm:rounded-tr-none"
  />
) : (
  <MediaPlaceholder
    ratio="portrait"
    tone={displayProduct.images[0]?.tone}
    label={displayProduct.name}
    className="rounded-l-lg sm:rounded-l-lg sm:rounded-tr-none"
  />
)}
            <div className="flex flex-col gap-4 p-8">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{displayProduct.collectionLabel}</Badge>
                {displayProduct.isNew ? <Badge variant="brass">New</Badge> : null}
                {displayProduct.salePrice !== undefined ? <Badge variant="destructive">Sale</Badge> : null}
              </div>

              <h2 className="font-display text-heading-lg text-foreground">{displayProduct.name}</h2>

              <div className="flex items-center gap-2 font-mono text-body-md">
                {displayProduct.salePrice !== undefined ? (
                  <>
                    <span className="text-brass-dark">{formatCurrency(displayProduct.salePrice)}</span>
                    <span className="text-muted-foreground line-through">
                      {formatCurrency(displayProduct.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-ink">{formatCurrency(displayProduct.price)}</span>
                )}
              </div>

              <p className="text-body-sm text-muted-foreground">
                {displayProduct.categoryLabels.join(" · ")} — {displayProduct.images.length} images available.
              </p>

              <p className="text-body-sm text-muted-foreground">
                {displayProduct.inStock ? "In stock and ready to ship." : "Currently out of stock."}
              </p>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="primary" size="lg" className="flex-1">
                  <Link href={ROUTES.product(displayProduct.slug)}>View Full Details</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  aria-pressed={isWishlisted}
                  onClick={() => toggleWishlist(displayProduct.id)}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted && "fill-brass-dark text-brass-dark")} aria-hidden="true" />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export { QuickViewDialog };
