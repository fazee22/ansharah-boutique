import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Product } from "@/types/product";

export interface ProductTabsProps {
  product: Product;
}

/**
 * The detail page's five information tabs. Content is a mix of
 * per-product data (description, fabric, care instructions) and
 * site-wide policy copy (shipping, returns) — the latter is written
 * once here rather than duplicated per product.
 */
function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="fabric">Fabric Details</TabsTrigger>
        <TabsTrigger value="shipping">Shipping Information</TabsTrigger>
        <TabsTrigger value="returns">Return Policy</TabsTrigger>
        <TabsTrigger value="care">Care Guide</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <p className="max-w-3xl leading-relaxed">{product.description}</p>
      </TabsContent>

      <TabsContent value="fabric">
        <dl className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">Fabric</dt>
            <dd className="text-ink">{product.collectionLabel}</dd>
          </div>
          <div>
            <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">Collection</dt>
            <dd className="text-ink">{product.categoryLabels[0]}</dd>
          </div>
          <div>
            <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">Piece Type</dt>
            <dd className="text-ink">{product.categoryLabels[1] ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-mono text-caption uppercase tracking-wide text-muted-foreground">SKU</dt>
            <dd className="text-ink">{product.sku}</dd>
          </div>
        </dl>
      </TabsContent>

      <TabsContent value="shipping">
        <div className="flex max-w-2xl flex-col gap-3">
          <p>
            Orders are dispatched within {product.deliveryEstimateDays[0]}–{product.deliveryEstimateDays[1]}{" "}
            business days, tracked from our atelier to your door.
          </p>
          <p>Standard delivery is complimentary on orders over PKR 15,000; a flat rate applies below that.</p>
          <p>International shipping is available at checkout once that flow launches.</p>
        </div>
      </TabsContent>

      <TabsContent value="returns">
        <div className="flex max-w-2xl flex-col gap-3">
          <p>Unworn pieces with tags attached may be returned within 7 days of delivery for store credit.</p>
          <p>Sale items are final and not eligible for return or exchange.</p>
          <p>To start a return, contact us with your order number and reason for return.</p>
        </div>
      </TabsContent>

      <TabsContent value="care">
        <ul className="flex max-w-2xl flex-col gap-2">
          {product.careInstructions.map((instruction) => (
            <li key={instruction} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden="true" />
              {instruction}
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
}

export { ProductTabs };
