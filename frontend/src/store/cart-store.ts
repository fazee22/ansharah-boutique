"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  imageTone: "canvas" | "evergreen" | "ink";
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
}

/**
 * Client-only cart state, persisted to localStorage — same pattern
 * and same caveat as `store/wishlist-store.ts`. `app/(site)/cart/page.tsx`
 * (Phase 8) and `app/(site)/checkout/page.tsx` (Phase 10) are both
 * built on top of this store; checkout's `clearCart()` call is the
 * only place lines are ever cleared as a batch. A future phase
 * migrating this to a server-persisted cart only needs to change this
 * file.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.lines.find((line) => line.productId === product.id);

          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.productId === product.id
                  ? { ...line, quantity: line.quantity + quantity }
                  : line,
              ),
            };
          }

          const newLine: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            imageTone: product.images[0]?.tone ?? "canvas",
            imageUrl: product.images[0]?.url,
            quantity,
          };

          return { lines: [...state.lines, newLine] };
        });
      },

      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.productId !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.productId === productId ? { ...line, quantity: Math.max(1, quantity) } : line,
          ),
        })),

      clearCart: () => set({ lines: [] }),

      itemCount: () => get().lines.reduce((sum, line) => sum + line.quantity, 0),
    }),
    { name: "luxury-cart" },
  ),
);
