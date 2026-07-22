import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

export interface ProductInfoProps {
  product: Product;
}

/**
 * The upper information block on the product detail page: name, SKU,
 * collection/category/fabric trail, price + sale price + discount
 * badge, availability, and the short description. Deliberately
 * separate from `ProductActions` below it — this component is pure
 * display, no interactive state.
 */
function ProductInfo({ product }: ProductInfoProps) {
  const hasSale = product.salePrice !== undefined;
  const discountPercent = hasSale
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline">{product.categoryLabels[0]}</Badge>
        {product.isNew ? <Badge variant="brass">New Arrival</Badge> : null}
        {hasSale ? <Badge variant="destructive">{discountPercent}% Off</Badge> : null}
      </div>

      <h1 className="font-display text-display-sm font-light text-foreground sm:text-display-md">
        {product.name}
      </h1>

      <div className="flex items-baseline gap-3 font-mono text-heading-md">
        {hasSale ? (
          <>
            <span className="text-brass-dark">{formatCurrency(product.salePrice!)}</span>
            <span className="text-body-md text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </span>
          </>
        ) : (
          <span className="text-ink">{formatCurrency(product.price)}</span>
        )}
      </div>

      <p className="max-w-lg text-body-sm text-muted-foreground">{product.shortDescription}</p>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-hairline py-4 text-body-sm sm:grid-cols-3">
        <div>
          <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">SKU</dt>
          <dd className="text-ink">{product.sku}</dd>
        </div>
        <div>
          <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">Fabric</dt>
          <dd className="text-ink">{product.collectionLabel}</dd>
        </div>
        <div>
          <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Availability
          </dt>
          <dd className={product.inStock ? "text-evergreen" : "text-destructive"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export { ProductInfo };
