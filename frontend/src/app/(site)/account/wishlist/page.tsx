"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "@/store/toast-store";
import { getProductById } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

/**
 * Deliberately NOT wrapped in `CustomerGuard` — the wishlist works
 * for guests (see `store/wishlist-store.ts`'s Phase 8 decision), so
 * this page has to too.
 */
export default function WishlistPage() {
  const productIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const addToCart = useCartStore((state) => state.addItem);

  const products = productIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  function handleMoveToCart(productId: string) {
    const product = getProductById(productId);
    if (!product) return;
    addToCart(product, 1);
    toggleWishlist(productId);
    toast(`${product.name} moved to your bag.`, "success");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Wishlist</h1>
        <p className="text-body-sm text-muted-foreground">
          {products.length} piece{products.length === 1 ? "" : "s"} saved.
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save pieces you love while you browse — they'll be waiting for you here."
          action={{ label: "Explore Collections", href: ROUTES.collections }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 rounded-lg border border-hairline bg-porcelain p-3">
              <Link href={ROUTES.product(product.slug)} className="block overflow-hidden rounded-md">
                <MediaPlaceholder ratio="portrait" tone={product.images[0]?.tone} label={product.images[0]?.alt ?? product.name} />
              </Link>
              <div className="flex flex-col gap-1">
                <Link href={ROUTES.product(product.slug)} className="line-clamp-1 text-body-sm text-ink hover:text-brass-dark">
                  {product.name}
                </Link>
                <span className="font-mono text-caption text-muted-foreground">
                  {formatCurrency(product.salePrice ?? product.price)}
                </span>
              </div>
              <div className="mt-auto flex gap-2">
                <Button variant="primary" size="sm" className="flex-1" onClick={() => handleMoveToCart(product.id)}>
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  Move to Bag
                </Button>
                <button
                  type="button"
                  aria-label={`Remove ${product.name} from wishlist`}
                  onClick={() => toggleWishlist(product.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
