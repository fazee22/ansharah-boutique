import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/collections/product-card-skeleton";

/**
 * Next.js `loading.tsx` for the entire `/collections` segment —
 * shown while a collection page's data resolves. Mirrors the real
 * page's shape (hero + grid) so there's no layout shift once content
 * arrives.
 */
export default function CollectionsLoading() {
  return (
    <Container className="flex flex-col gap-10 py-12 sm:py-16">
      <div className="flex flex-col gap-4 border-b border-hairline pb-8">
        <Skeleton className="h-3 w-40 rounded" />
        <Skeleton className="h-9 w-64 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden flex-col gap-4 lg:flex">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-24 w-full rounded" />
          <Skeleton className="h-24 w-full rounded" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </Container>
  );
}
