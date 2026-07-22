export interface ProductImage {
  id: string;
  tone?: "canvas" | "evergreen" | "ink";
  url?: string;
  alt: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "featured" | "best-selling";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Stock-keeping code, e.g. "VR-KHD-0001" — deterministic, not admin-assigned yet (see `lib/mock/products.ts`). */
  sku: string;
  /** Nav node ids from root to leaf, e.g. ["collections","winter-collection","winter-collection-2-piece","winter-collection-2-piece-khaddar"]. */
  categoryPath: string[];
  /** Human-readable trail, e.g. ["Winter Collection", "2 Piece", "Khaddar"]. */
  categoryLabels: string[];
  /** The immediate (most specific) category label — rendered as the product card's collection badge. */
  collectionLabel: string;
  price: number;
  salePrice?: number;
  currency: "PKR";
  images: ProductImage[];
  isNew: boolean;
  isFeatured: boolean;
  inStock: boolean;
  /** Higher = sold more — backs the "Best Selling" sort until real order data exists. */
  salesRank: number;
  /** ISO date string — backs the "Newest" sort. */
  createdAt: string;
  shortDescription: string;
  description: string;
  careInstructions: string[];
  /** [fastest, slowest] estimated delivery, in business days. */
  deliveryEstimateDays: [number, number];
}
