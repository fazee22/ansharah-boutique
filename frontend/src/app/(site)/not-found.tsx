import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * Next.js `not-found.tsx` for the entire `(site)` route group — any
 * unresolved storefront URL, or an explicit `notFound()` call (e.g.
 * an invalid product slug), renders this instead of the framework
 * default. Still wrapped in `(site)/layout.tsx`'s Header/Footer, so a
 * lost visitor never loses the ability to navigate back into the
 * site.
 */
export default function StorefrontNotFound() {
  return (
    <Container width="narrow" className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-hairline text-brass-dark">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-overline uppercase tracking-widest text-muted-foreground">Error 404</span>
        <h1 className="font-display text-display-sm font-light text-foreground sm:text-display-md">
          This page has wandered off
        </h1>
        <p className="mx-auto max-w-md text-body-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, may have moved, or the link might be
          mistyped. Let&apos;s get you back to something considered.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="primary" size="lg">
          <Link href={ROUTES.home}>Back to Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={ROUTES.collections}>Browse Collections</Link>
        </Button>
      </div>
    </Container>
  );
}
