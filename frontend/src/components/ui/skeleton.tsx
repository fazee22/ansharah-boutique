import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Base loading-state block. Compose into feature-specific skeletons
 * (e.g. a future `ProductCardSkeleton`) by stacking/sizing instances
 * of this primitive rather than building bespoke shimmer markup per
 * feature.
 */
function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-stone/60", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
