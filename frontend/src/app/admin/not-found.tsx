import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/** Next.js `not-found.tsx` for the entire `admin/` segment — covers an invalid product id, a stale edit link, or any other admin route that doesn't resolve. */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas text-center">
      <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-heading-lg text-foreground">Not found</h1>
        <p className="text-body-sm text-muted-foreground">That admin page or record doesn&apos;t exist.</p>
      </div>
      <Button asChild variant="primary" size="md">
        <Link href={ROUTES.admin.root}>Back to Dashboard</Link>
      </Button>
    </div>
  );
}
