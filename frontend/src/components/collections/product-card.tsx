"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { Card, CardBody } from "@/components/shared/card";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { formatCurrency } from "@/lib/format";
import { optimizeImage } from "@/lib/optimize-image";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  /** Marks this card's image as an LCP candidate — pass `true` for the first row of a grid. */
  priority?: boolean;
}

/**
 * The catalog's one reusable product card — every collection page,
 * search results grid, and the homepage's `NewArrivalsPreview` (once
 * migrated off its Phase 3 placeholder items) render through this
 * component. Image swaps to the second photo on hover as a lightweight
 * "second angle" preview, a common premium-fashion-ecommerce pattern.
 */
function ProductCard({ product, onQuickView, priority = false }: ProductCardProps) {
  void priority; // reserved for next/image `priority` once real photography replaces MediaPlaceholder
  const [isHovered, setIsHovered] = useState(false);
const hasMounted = useHasMounted();
const isWishlistedRaw = useWishlistStore((state) => state.isWishlisted(product.id));
const isWishlisted = hasMounted && isWishlistedRaw;
const toggleWishlist = useWishlistStore((state) => state.toggle);

  const displayImage =
    isHovered && product.images[1] ? product.images[1] : product.images[0];
  const hasSale = product.salePrice !== undefined;

  return (
    <Card
      className="group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link href={ROUTES.product(product.slug)} className="block" aria-label={product.name}>
  {displayImage?.url ? (
    // eslint-disable-next-line @next/next/no-img-element -- real, admin-uploaded product photo
    <img
      src={optimizeImage(displayImage.url, 600)}
      alt={displayImage.alt ?? product.name}
      className={cn(
        "aspect-[3/4] w-full object-cover transition-transform duration-[900ms] ease-luxury-ease",
        isHovered && "scale-105",
      )}
    />
  ) : (
    <MediaPlaceholder
      ratio="portrait"
      tone={displayImage?.tone}
      label={displayImage?.alt ?? product.name}
      className={cn(
        "transition-transform duration-[900ms] ease-luxury-ease",
        isHovered && "scale-105",
      )}
    />
  )}
          {/* `priority` is threaded through today only as a signal for
              ProductGrid to pass `true` on the first row; it becomes a
              real `next/image priority` prop once MediaPlaceholder is
              swapped for actual photography. */}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <Badge variant="outline" className="border-none bg-porcelain/90 text-ink backdrop-blur">
            {product.collectionLabel}
          </Badge>
          {product.isNew ? <Badge variant="brass">New</Badge> : null}
          {hasSale ? <Badge variant="destructive">Sale</Badge> : null}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-400 ease-luxury-ease group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            onClick={() => toggleWishlist(product.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-porcelain/90 text-ink shadow-subtle backdrop-blur transition-colors hover:bg-porcelain"
          >
            <Heart
              className={cn("h-4 w-4", isWishlisted && "fill-brass-dark text-brass-dark")}
              aria-hidden="true"
            />
          </button>
          {onQuickView ? (
            <button
              type="button"
              aria-label={`Quick view ${product.name}`}
              onClick={() => onQuickView(product)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-porcelain/90 text-ink shadow-subtle backdrop-blur transition-colors hover:bg-porcelain"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {!product.inStock ? (
          <div className="absolute inset-x-0 bottom-0 bg-ink/85 py-2 text-center font-mono text-[0.6875rem] uppercase tracking-widest text-porcelain">
            Out of Stock
          </div>
        ) : null}
      </div>

      <CardBody>
        <Link href={ROUTES.product(product.slug)} className="flex flex-col gap-1">
          <p className="font-display text-heading-sm text-foreground transition-colors group-hover:text-brass-dark">
            {product.name}
          </p>
          <div className="flex items-center gap-2 font-mono text-body-sm">
            {hasSale ? (
              <>
                <span className="text-brass-dark">{formatCurrency(product.salePrice!)}</span>
                <span className="text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-ink">{formatCurrency(product.price)}</span>
            )}
          </div>
        </Link>
      </CardBody>
    </Card>
  );
}

export { ProductCard };
