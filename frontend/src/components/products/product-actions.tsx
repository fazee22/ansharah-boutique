"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, Share2, Link2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { toast } from "@/store/toast-store";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { env } from "@/config/env";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export interface ProductActionsProps {
  product: Product;
}

/**
 * Every purchase-adjacent action on the product detail page: quantity
 * stepper, Add to Cart, Buy Now, Wishlist, Share/Copy Link, and the
 * WhatsApp order button. "Buy Now" adds to cart and goes straight to
 * `/checkout` (Phase 10 — checkout is real now, so this no longer
 * needs to fall back to "added to bag, checkout arrives later").
 */
function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const { data: settings } = useSiteSettings();

  // Deterministic canonical URL, not `window.location.href` — using
  // the live location would differ between the server-rendered HTML
  // and the client's first hydration pass (a real hydration-mismatch
  // risk), and a canonical link is what you actually want to share
  // anyway (no stray query params from search/filters).
  const productUrl = `${env.app.url}${ROUTES.product(product.slug)}`;

  function handleAddToCart() {
    addItem(product, quantity);
    toast(`Added ${quantity > 1 ? `${quantity} × ` : ""}${product.name} to your bag.`, "success");
  }

  function handleBuyNow() {
    addItem(product, quantity);
    router.push(ROUTES.checkout);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: productUrl });
      } catch {
        // User cancelled the native share sheet — not an error worth surfacing.
      }
      return;
    }
    await handleCopyLink();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast("Product link copied.", "success");
    } catch {
      toast("Couldn't copy the link — copy it from your address bar instead.", "error");
    }
  }

  const whatsAppLink = buildWhatsAppOrderLink(product, { quantity, productUrl, phoneNumber: settings?.whatsapp.number });
  const showWhatsAppButton = !settings?.whatsapp || (settings.whatsapp.enabled && settings.whatsapp.orderButtonEnabled);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
          Quantity
        </span>
        <div className="flex items-center rounded-md border border-hairline">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-ink/5"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center font-mono text-body-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((value) => value + 1)}
            className="flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-ink/5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          {product.inStock ? "Add to Bag" : "Out of Stock"}
        </Button>
        <Button
          variant="brass"
          size="lg"
          className="flex-1"
          disabled={!product.inStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {showWhatsAppButton ? (
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "flex h-12 items-center justify-center gap-2.5 rounded-md bg-[#25D366] font-body text-body-sm font-medium text-ink",
            "transition-transform duration-300 ease-luxury-ease hover:scale-[1.01] active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2",
          )}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Order on WhatsApp
        </a>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          aria-pressed={isWishlisted}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-brass-dark text-brass-dark")} aria-hidden="true" />
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </Button>
        <Button variant="outline" size="md" onClick={handleShare} aria-label="Share this product">
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="outline" size="md" onClick={handleCopyLink} aria-label="Copy product link">
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export { ProductActions };
