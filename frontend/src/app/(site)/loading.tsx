import { Spinner } from "@/components/shared/spinner";

/**
 * Route-level loading UI (Next.js `loading.tsx` convention) — shown
 * automatically while a route segment's data is being fetched. Kept
 * intentionally minimal at the root; feature routes add their own
 * `loading.tsx` with content-shaped skeletons (see `CardSkeleton`)
 * once they exist.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
