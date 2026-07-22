import { mockReviews } from "@/lib/mock/reviews";
import type { Review } from "@/types/review";

export function getReviewsForProduct(productId: string): Review[] {
  return mockReviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface RatingSummary {
  average: number;
  count: number;
  /** Count of reviews at each star rating, 1–5, for the ratings breakdown bar chart. */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export function getRatingSummary(reviews: Review[]): RatingSummary {
  const distribution: RatingSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const review of reviews) {
    distribution[review.rating] += 1;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = reviews.length ? total / reviews.length : 0;

  return { average, count: reviews.length, distribution };
}
