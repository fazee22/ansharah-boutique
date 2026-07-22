"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

/**
 * Cart page — built alongside `store/cart-store.ts` (Phase 5) so the
 * header's cart badge doesn't lead to a dead end. Lists lines,
 * quantity controls, and a subtotal, then hands off to the real
 * `/checkout` flow (Phase 10) rather than computing a final total
 * itself — shipping is only known once checkout's flat-rate/free
 * threshold logic runs there.
 */
export default function CartPage() {
  const lines = useCartStore((state) => state.lines);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = lines.reduce((sum, line) => sum + (line.salePrice ?? line.price) * line.quantity, 0);

  if (lines.length === 0) {
    return (
      <Container className="py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Pieces you add will appear here — browse the collections to find something considered."
          action={{ label: "Browse Collections", href: ROUTES.collections }}
        />
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-6 w-6 text-ink" aria-hidden="true" />
        <h1 className="font-display text-display-sm text-foreground">Your Bag</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col divide-y divide-hairline">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-4 py-6">
              <Link href={ROUTES.product(line.slug)} className="shrink-0">
                {line.imageUrl ? (
  // eslint-disable-next-line @next/next/no-img-element -- real, admin-uploaded product photo
  <img src={line.imageUrl} alt={line.name} className="h-24 w-24 rounded-md object-cover" />
) : (
  <MediaPlaceholder ratio="square" tone={line.imageTone} label={line.name} className="h-24 w-24 rounded-md" />
)}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <Link href={ROUTES.product(line.slug)} className="font-display text-heading-sm text-foreground hover:text-brass-dark">
                    {line.name}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Remove ${line.name} from bag`}
                    onClick={() => removeItem(line.productId)}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-md border border-hairline">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink hover:bg-ink/5"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center font-mono text-body-sm">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink hover:bg-ink/5"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <span className="font-mono text-body-sm text-ink">
                    {formatCurrency((line.salePrice ?? line.price) * line.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="flex h-fit flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6">
          <h2 className="font-display text-heading-sm text-foreground">Order Summary</h2>
          <div className="flex items-center justify-between text-body-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono text-ink">{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-caption text-muted-foreground">Shipping is calculated at checkout.</p>
          <Button asChild variant="primary" size="lg" className="mt-2">
            <Link href={ROUTES.checkout}>Proceed to Checkout</Link>
          </Button>
        </aside>
      </div>
    </Container>
  );
}
