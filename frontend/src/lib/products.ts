import { mockProducts } from "@/lib/mock/products";
import type { Product, SortOption } from "@/types/product";
import type { NavNode } from "@/types/navigation";

/** Finds a single product by its URL slug — the product detail page's primary lookup. */
export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.slug === slug);
}

/** Finds a single product by its id — used by the Wishlist page (Phase 8) to resolve `store/wishlist-store.ts`'s stored ids back into full product records. */
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

/**
 * Other products in the exact same leaf category (e.g. other
 * "Khaddar" pieces) — the closest possible match, used for "Related
 * Products." Falls back to the next category level up
 * (`categoryPath` one segment shorter) if the leaf category is too
 * small to fill a row, so the section never renders half-empty.
 */
export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  const sameLeaf = mockProducts.filter(
    (candidate) => candidate.id !== product.id && candidate.collectionLabel === product.collectionLabel,
  );

  if (sameLeaf.length >= limit) return sameLeaf.slice(0, limit);

  const parentId = product.categoryPath[product.categoryPath.length - 2];
  const sameParent = parentId
    ? mockProducts.filter(
        (candidate) => candidate.id !== product.id && candidate.categoryPath.includes(parentId),
      )
    : [];

  const merged = [...sameLeaf, ...sameParent.filter((c) => !sameLeaf.includes(c))];
  return merged.slice(0, limit);
}

/**
 * Broader discovery than `getRelatedProducts`: other products from
 * the same top-level collection (e.g. any Winter Collection piece)
 * but a *different* leaf category, so "You May Also Like" doesn't
 * just repeat the related-products row.
 */
export function getYouMayAlsoLike(product: Product, limit: number = 4): Product[] {
  const topLevelId = product.categoryPath[0];
  if (!topLevelId) return [];

  const pool = mockProducts.filter(
    (candidate) =>
      candidate.id !== product.id &&
      candidate.categoryPath[0] === topLevelId &&
      candidate.collectionLabel !== product.collectionLabel,
  );

  // Deterministic "shuffle" (seeded by the product id's char codes,
  // not Math.random — same SSR/CSR-safety reasoning as the mock
  // catalog itself) so the selection looks varied but never causes a
  // hydration mismatch.
  const seed = product.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const ranked = [...pool].sort((a, b) => {
    const rankA = (a.salesRank + seed) % 997;
    const rankB = (b.salesRank + seed) % 997;
    return rankB - rankA;
  });

  return ranked.slice(0, limit);
}

/**
 * Every product whose category trail includes `node.id` — works
 * identically whether `node` is a leaf (e.g. "Khaddar", returning
 * only Khaddar products) or a group (e.g. "Winter Collection",
 * returning every descendant product), because `Product.categoryPath`
 * stores the full ancestor-to-leaf id chain. See
 * `lib/mock/products.ts` for how that chain is built.
 */
export function getProductsForNode(node: NavNode): Product[] {
  return mockProducts.filter((product) => product.categoryPath.includes(node.id));
}

export interface ProductFilters {
  collectionIds?: string[];
  pieceTypeLabels?: string[];
  fabricLabels?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
}

const idMatches = (product: Product, ids?: string[]) =>
  !ids?.length || ids.some((id) => product.categoryPath.includes(id));

const labelMatches = (product: Product, labels?: string[]) =>
  !labels?.length || labels.some((label) => product.categoryLabels.includes(label));

/** Applies every active filter as an AND — a product must satisfy all provided criteria. */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    if (!idMatches(product, filters.collectionIds)) return false;
    if (!labelMatches(product, filters.pieceTypeLabels)) return false;
    if (!labelMatches(product, filters.fabricLabels)) return false;
    if (filters.minPrice !== undefined && (product.salePrice ?? product.price) < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && (product.salePrice ?? product.price) > filters.maxPrice) return false;
    if (filters.inStockOnly && !product.inStock) return false;
    if (filters.isNew && !product.isNew) return false;
    if (filters.isFeatured && !product.isFeatured) return false;
    if (filters.isSale && product.salePrice === undefined) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case "price-desc":
      return sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case "featured":
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    case "best-selling":
      return sorted.sort((a, b) => b.salesRank - a.salesRank);
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export interface PaginatedProducts {
  items: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export function paginateProducts(products: Product[], page: number, perPage: number): PaginatedProducts {
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;

  return {
    items: products.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalItems,
    perPage,
  };
}

/**
 * Case-insensitive substring match over product name and category
 * labels — the engine behind the header's live search. Instant
 * because it runs against the in-memory mock catalog; swapping in a
 * real search endpoint later means this function becomes `async` and
 * every caller (`SearchOverlay`, `/search`) awaits it — no other
 * change required.
 */
export function searchProducts(query: string, limit?: number): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const matches = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.categoryLabels.some((label) => label.toLowerCase().includes(normalized)),
  );

  return limit ? matches.slice(0, limit) : matches;
}
