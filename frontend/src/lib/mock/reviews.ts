import { mockProducts } from "@/lib/mock/products";
import type { Review } from "@/types/review";

const REVIEWER_NAMES = [
  "Ayesha K.",
  "Fatima R.",
  "Zainab A.",
  "Hira M.",
  "Sana T.",
  "Mahnoor S.",
  "Alina F.",
  "Noor J.",
];

const REVIEW_TITLES: Record<number, string[]> = {
  5: ["Exactly as described", "Worth every rupee", "New favorite piece", "Beautifully made"],
  4: ["Really lovely", "Great, minor sizing note", "Happy with this"],
  3: ["Good, not perfect", "Nice but ran slightly large"],
};

const REVIEW_BODIES: Record<number, string[]> = {
  5: [
    "The fabric feels even better in person than in photos. Fit was true to size and the stitching is clearly well made.",
    "This is my third order from here and it's consistently this good. Considered, well-cut, and the color didn't fade after washing.",
  ],
  4: [
    "Lovely piece overall — I'd size down slightly next time, but the quality is there.",
    "Really happy with the fabric weight, especially for the price point. Delivery took a few extra days.",
  ],
  3: [
    "Nice fabric but ran a little large for me. Would recommend checking the size guide carefully.",
  ],
};

function seededRandom(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function pick<T>(list: T[], seed: number): T | undefined {
  if (!list.length) return undefined;
  return list[Math.floor(seededRandom(seed) * list.length)];
}

function buildReviewsForProduct(productId: string, productSeed: number, count: number): Review[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = productSeed * 97 + index;
    const rating = (3 + Math.floor(seededRandom(seed) * 3)) as Review["rating"]; // 3–5, skews positive
    const titles = REVIEW_TITLES[rating] ?? REVIEW_TITLES[5] ?? [];
    const bodies = REVIEW_BODIES[rating] ?? REVIEW_BODIES[5] ?? [];

    return {
      id: `review-${productId}-${index + 1}`,
      productId,
      authorName: pick(REVIEWER_NAMES, seed * 3) ?? "Verified Customer",
      rating,
      title: pick(titles, seed * 5) ?? "Lovely piece",
      body: pick(bodies, seed * 7) ?? "Great quality and true to the photos.",
      isVerifiedPurchase: seededRandom(seed * 11) > 0.2,
      createdAt: new Date(2026, 0, 1 + ((seed * 13) % 300)).toISOString(),
    };
  });
}

/**
 * Deterministic mock reviews, 2–6 per product, seeded by each
 * product's position in the catalog (same SSR/CSR-safety reasoning as
 * `lib/mock/products.ts` — no `Math.random()`). Stands in for a real
 * reviews API; the "Write a Review" form in `components/products/reviews-section.tsx`
 * is UI-only per this phase's brief ("Backend integration later").
 */
export const mockReviews: Review[] = mockProducts.flatMap((product, index) => {
  const count = 2 + (index % 5);
  return buildReviewsForProduct(product.id, index + 1, count);
});
