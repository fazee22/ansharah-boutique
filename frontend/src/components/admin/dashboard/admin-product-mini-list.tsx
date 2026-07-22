import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import type { AdminProduct } from "@/types/admin/product";

export interface AdminProductMiniListProps {
  title: string;
  products: AdminProduct[];
  emptyMessage: string;
  /** Rendered on the right of each row instead of the default price — e.g. a stock-quantity badge for the low-stock list. */
  renderTrailing?: (product: AdminProduct) => ReactNode;
}

/**
 * Compact product list shared by the dashboard's Low Stock, Featured
 * Products, and Recent Activity panels — one row layout, three
 * different data sources and an optional custom trailing element.
 */
function AdminProductMiniList({ title, products, emptyMessage, renderTrailing }: AdminProductMiniListProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
      <h3 className="font-display text-heading-sm text-foreground">{title}</h3>

      {products.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-hairline">
          {products.map((product) => {
            const image = product.images?.[0];
            return (
              <li key={product.id}>
                <Link
                  href={ROUTES.admin.productEdit(product.id)}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-ink/[0.02]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone/40 text-muted-foreground">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-only preview thumbnail of an admin-uploaded/seeded URL, not a storefront asset
                      <img src={image.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <span className="flex-1 truncate text-body-sm text-ink">{product.name}</span>
                  {renderTrailing ? (
                    renderTrailing(product)
                  ) : (
                    <span className="font-mono text-body-sm text-muted-foreground">
                      {formatCurrency(product.salePrice ?? product.price)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { AdminProductMiniList };
