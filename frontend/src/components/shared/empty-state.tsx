import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export interface EmptyStateAction {
  label: string;
  href: string;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
}

/**
 * Generic premium empty state — reused across Wishlist, Search (no
 * results), Order History, and Cart, each supplying its own
 * icon/copy/action rather than four one-off implementations. Distinct
 * from `components/collections/empty-state.tsx`, which is specific to
 * "filters narrowed a collection to zero results" and has its own
 * "Clear Filters" affordance that doesn't generalize here.
 */
function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Reveal className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline bg-porcelain text-muted-foreground">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-heading-md text-foreground">{title}</h3>
        <p className="max-w-sm text-body-sm text-muted-foreground">{description}</p>
      </div>
      {action ? (
        <Button asChild variant="primary" size="md">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </Reveal>
  );
}

export { EmptyState };
