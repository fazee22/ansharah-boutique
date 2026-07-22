import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Next.js `loading.tsx` for the `/products` segment — mirrors the real page's gallery/info layout so there's no shift once content arrives. */
export default function ProductLoading() {
  return (
    <Container className="flex flex-col gap-12 py-10 sm:py-14">
      <Skeleton className="h-3 w-64 rounded" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex gap-4 sm:gap-5">
          <div className="hidden flex-col gap-3 sm:flex">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="aspect-[3/4] flex-1 rounded-lg" />
        </div>

        <div className="flex flex-col gap-6">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton className="h-8 w-40 rounded" />
          <Skeleton className="h-20 w-full rounded" />
          <Skeleton className="h-24 w-full rounded" />
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
    </Container>
  );
}
