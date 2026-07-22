import Link from "next/link";
import { PackageX } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/** Next.js `not-found.tsx` for the `/products` segment — rendered when `getProductBySlug` fails to match a URL, via `notFound()` in `app/products/[slug]/page.tsx`. */
export default function ProductNotFound() {
  return (
    <Container className="flex flex-col items-center gap-5 py-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-porcelain text-muted-foreground">
        <PackageX className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-heading-lg text-foreground">
          We couldn&apos;t find that piece
        </h1>
        <p className="max-w-sm text-body-sm text-muted-foreground">
          It may have sold out or moved. Browse the current collections instead.
        </p>
      </div>
      <Button asChild variant="primary" size="md">
        <Link href={ROUTES.collections}>Browse Collections</Link>
      </Button>
    </Container>
  );
}
