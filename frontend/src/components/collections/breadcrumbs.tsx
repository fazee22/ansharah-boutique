import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Accessible breadcrumb trail (Home > Collections > Winter Collection
 * > 2 Piece > Khaddar). The final item is rendered as plain text with
 * `aria-current="page"`, never a link to itself. "Home" and
 * "Collections" are always present; `items` supplies everything after
 * that (category chain, and — on the product detail page — the
 * product name as the final, non-linked crumb).
 */
function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
      <Link href={ROUTES.home} className="transition-colors hover:text-brass-dark">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      {items.length === 0 ? (
        <span aria-current="page" className="text-ink">
          Collections
        </span>
      ) : (
        <Link href={ROUTES.collections} className="transition-colors hover:text-brass-dark">
          Collections
        </Link>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            {isLast || !item.href ? (
              <span aria-current={isLast ? "page" : undefined} className="text-ink">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-brass-dark">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export { Breadcrumbs };
