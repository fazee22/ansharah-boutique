"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * Next.js `error.tsx` for the `(site)` route group — catches any
 * unhandled render/runtime error in a storefront page and shows this
 * instead of the framework's default error screen. Must be a Client
 * Component (Next.js requirement for error boundaries) and receives
 * `reset()` to retry the failed render without a full page reload.
 *
 * Deliberately renders WITHOUT `(site)/layout.tsx`'s Header/Footer —
 * an error boundary catches errors thrown by its own subtree,
 * which in the App Router includes the layout that would normally
 * wrap it, so this page supplies its own minimal chrome rather than
 * risk the same broken layout re-throwing.
 */
export default function StorefrontError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Real error reporting (Sentry, etc.) would hook in here — logging
    // to the console keeps this genuinely functional in the meantime
    // rather than a silent no-op.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <Container width="narrow" className="flex flex-col items-center gap-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-destructive/30 text-destructive">
          <AlertOctagon className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-overline uppercase tracking-widest text-muted-foreground">
            Something went wrong
          </span>
          <h1 className="font-display text-display-sm font-light text-foreground sm:text-display-md">
            We hit a snag
          </h1>
          <p className="mx-auto max-w-md text-body-md text-muted-foreground">
            An unexpected error interrupted this page. It&apos;s been logged — try again, or head back to
            the homepage.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="lg" onClick={reset}>
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={ROUTES.home}>Back to Home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
