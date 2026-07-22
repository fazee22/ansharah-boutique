"use client";

import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

/**
 * Shown when filters/search narrow a collection down to zero
 * products. Distinct from a 404 (`app/collections/not-found.tsx`) —
 * this is a valid collection with an over-narrow filter selection,
 * not a missing route.
 */
function EmptyState({
  title = "No pieces match your filters",
  description = "Try widening your selection — remove a filter or two and the edit will open back up.",
  onClearFilters,
}: EmptyStateProps) {
  return (
    <Reveal className="flex flex-col items-center gap-5 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-porcelain text-muted-foreground">
        <PackageSearch className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-heading-md text-foreground">{title}</h3>
        <p className="max-w-sm text-body-sm text-muted-foreground">{description}</p>
      </div>
      {onClearFilters ? (
        <Button variant="outline" size="md" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : null}
    </Reveal>
  );
}

export { EmptyState };
