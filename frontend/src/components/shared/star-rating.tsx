import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

const sizeClass = { sm: "h-3.5 w-3.5", md: "h-4 w-4" };

/**
 * Read-only 5-star display, supporting fractional ratings (e.g. 4.3)
 * via a clipped partial-fill overlay per star rather than rounding to
 * the nearest whole star. Used by `ReviewsSection`'s average-rating
 * header and each individual review.
 */
function StarRating({ rating, size = "sm", className }: StarRatingProps) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
      className={cn("flex items-center gap-0.5 text-brass", className)}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fillPercent = Math.max(0, Math.min(1, rating - index)) * 100;
        return (
          <span key={index} className="relative inline-flex" aria-hidden="true">
            <Star className={cn(sizeClass[size], "text-stone")} />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className={cn(sizeClass[size], "fill-brass text-brass")} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export { StarRating };
