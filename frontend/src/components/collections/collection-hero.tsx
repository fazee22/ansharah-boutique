import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

export interface CollectionHeroProps {
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  productCount: number;
}

/**
 * Compact header for every collection/category page: breadcrumb
 * trail, title, optional description, and a live product count. Used
 * identically whether the resolved node is a top-level collection, a
 * piece-type group, or a leaf fabric — the data driving it already
 * varies per page, the component doesn't need to.
 */
function CollectionHero({ title, description, breadcrumbItems, productCount }: CollectionHeroProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-hairline pb-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-display-sm font-light text-foreground sm:text-display-md">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-body-md text-muted-foreground">{description}</p>
        ) : null}
        <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
          {productCount} {productCount === 1 ? "Piece" : "Pieces"}
        </span>
      </div>
    </div>
  );
}

export { CollectionHero };
