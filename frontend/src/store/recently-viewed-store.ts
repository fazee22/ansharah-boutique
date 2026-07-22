"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ENTRIES = 8;

interface RecentlyViewedState {
  productIds: string[];
  record: (productId: string) => void;
}

/**
 * Tracks product detail page visits, most-recent-first, capped at
 * `MAX_ENTRIES`. Persisted to localStorage — same client-only
 * pattern as `wishlist-store.ts` and `cart-store.ts`. Populated by
 * `RecentlyViewedTracker` (a side-effect-only component mounted on
 * the product detail page); read by `ProductRow` via
 * `app/products/[slug]/page.tsx`.
 */
export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],
      record: (productId) =>
        set((state) => ({
          productIds: [productId, ...state.productIds.filter((id) => id !== productId)].slice(0, MAX_ENTRIES),
        })),
    }),
    { name: "luxury-recently-viewed" },
  ),
);
