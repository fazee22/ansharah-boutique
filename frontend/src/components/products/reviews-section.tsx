"use client";

import { useState, type FormEvent } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/store/toast-store";
import { formatDate } from "@/lib/format";
import { getReviewsForProduct, getRatingSummary } from "@/lib/reviews";
import { cn } from "@/lib/utils";

export interface ReviewsSectionProps {
  productId: string;
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-caption text-muted-foreground">
      <span className="w-10 font-mono">{star} star</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-stone/50">
        <div className="h-full rounded-pill bg-brass" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 text-right font-mono">{count}</span>
    </div>
  );
}

function WriteReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) {
      toast("Please select a star rating.", "error");
      return;
    }

    // No reviews API exists yet ("Backend integration later" per the
    // Phase 5 brief) — this confirms the form's own validation and
    // gives real, non-simulated feedback rather than silently doing
    // nothing.
    toast("Thanks — your review has been noted (submission opens once reviews go live).", "success");
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-hairline p-6">
      <h3 className="font-display text-heading-sm text-foreground">Write a Review</h3>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Your Rating
        </span>
        <div className="flex gap-1" onMouseLeave={() => setHoveredStar(0)}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoveredStar || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} out of 5 stars`}
                aria-pressed={rating === star}
                onMouseEnter={() => setHoveredStar(star)}
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star className={cn("h-6 w-6", isFilled ? "fill-brass text-brass" : "text-stone")} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-title" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Title
        </label>
        <input
          id="review-title"
          type="text"
          required
          placeholder="Sum up your experience"
          className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-body" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Review
        </label>
        <textarea
          id="review-body"
          required
          rows={4}
          placeholder="What did you like or dislike? How did it fit?"
          className="rounded-md border border-hairline bg-canvas p-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-fit">
        Submit Review
      </Button>
    </form>
  );
}

/**
 * Reviews UI — average rating + star distribution, the review list
 * (each with a Verified Purchase badge where applicable), and a Write
 * a Review form. Reads from the deterministic mock catalog
 * (`lib/mock/reviews.ts`); the form is intentionally UI-only per the
 * Phase 5 brief ("Backend integration later").
 */
function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const reviews = getReviewsForProduct(productId);
  const summary = getRatingSummary(reviews);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex flex-col items-start gap-1">
          <span className="font-display text-display-sm font-light text-foreground">
            {summary.average.toFixed(1)}
          </span>
          <StarRating rating={summary.average} size="md" />
          <span className="text-caption text-muted-foreground">
            Based on {summary.count} {summary.count === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <RatingBar key={star} star={star} count={summary.distribution[star]} total={summary.count} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-heading-sm text-foreground">Customer Reviews</h3>
        <Button variant="outline" size="md" onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm ? <WriteReviewForm onSubmitted={() => setShowForm(false)} /> : null}

      {reviews.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">
          No reviews yet — be the first to share your experience.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-hairline">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-2 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="font-display text-heading-sm text-foreground">{review.title}</span>
                {review.isVerifiedPurchase ? (
                  <span className="flex items-center gap-1 rounded-pill bg-evergreen/10 px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wide text-evergreen">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    Verified Purchase
                  </span>
                ) : null}
              </div>
              <p className="text-body-sm text-muted-foreground">{review.body}</p>
              <span className="font-mono text-caption text-muted-foreground">
                {review.authorName} — {formatDate(review.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Separator />
    </div>
  );
}

export { ReviewsSection };
