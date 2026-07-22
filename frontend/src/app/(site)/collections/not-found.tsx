import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * Next.js `not-found.tsx` for the `/collections` segment — rendered
 * when `resolveNodePath` fails to match a URL against the navigation
 * tree (an invalid or stale collection URL), via `notFound()` in
 * `app/collections/[...slug]/page.tsx`.
 */
export default function CollectionNotFound() {
  return (
    <Container className="flex flex-col items-center gap-5 py-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-porcelain text-muted-foreground">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-heading-lg text-foreground">
          We couldn&apos;t find that collection
        </h1>
        <p className="max-w-sm text-body-sm text-muted-foreground">
          The category you&apos;re looking for may have moved or doesn&apos;t exist. Browse
          everything we carry instead.
        </p>
      </div>
      <Button asChild variant="primary" size="md">
        <Link href={ROUTES.collections}>Browse All Collections</Link>
      </Button>
    </Container>
  );
}
