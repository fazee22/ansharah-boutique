import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder matching `ProductCard`'s exact proportions
 * (image + badge row + title + price), used by `ProductGrid` while
 * `isLoading` is true so a filter/sort/page change never causes
 * layout shift once real cards render in.
 */
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-lg border border-hairline">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="flex flex-col gap-2 px-5 pb-5">
        <Skeleton className="h-3 w-1/3 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}

export { ProductCardSkeleton };
