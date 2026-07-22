"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

/**
 * Client-only wishlist state, persisted to localStorage (via
 * Zustand's `persist` middleware) so a toggled item survives a
 * refresh — this is the storefront's Guest Wishlist.
 *
 * Phase 8 decision: it stays this way for logged-in customers too,
 * rather than syncing to the real `wishlist_items` backend table
 * built this phase (`backend/app/Services/WishlistService.php`,
 * `/api/v1/account/wishlist/*`). The blocker is upstream: the
 * storefront still runs on `lib/mock/products.ts` (the Phase 6/7
 * scope decision), whose product ids are slug-based strings with no
 * relationship to the real, numeric-id `products` table the backend
 * wishlist references. Syncing would mean either faking an id
 * mapping or wiring the storefront onto the real catalog — a much
 * larger change than "add a wishlist," and explicitly out of scope
 * for this phase (see PROJECT_MEMORY.md). The backend piece is fully
 * built and tested against real products now, ready to activate the
 * moment that storefront migration happens — this store is the only
 * file that would need to change.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isWishlisted: (productId) => get().productIds.includes(productId),
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
    }),
    { name: "luxury-wishlist" },
  ),
);
