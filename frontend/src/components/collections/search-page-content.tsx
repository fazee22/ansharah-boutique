"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, SearchX, Clock, X } from "lucide-react";
import { ProductGrid } from "./product-grid";
import { QuickViewDialog } from "./quick-view-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useRecentSearchesStore } from "@/store/recent-searches-store";
import { searchProducts } from "@/lib/products";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/product";

export interface SearchPageContentProps {
  initialQuery: string;
}

/**
 * Client body of `/search`. Keeps the input live-searchable (every
 * keystroke re-queries the in-memory catalog, same engine as the
 * header's `SearchOverlay`) while also syncing the URL's `?q=` param
 * via `router.replace` (no scroll jump, no new history entry per
 * keystroke) so the results page stays shareable/bookmarkable.
 *
 * Phase 8 additions: recent searches shown when the input is empty,
 * saved once a search actually returns here, and a premium
 * "No Results" state (via the shared `EmptyState`) instead of the
 * generic "clear your filters" copy — search has no filters to clear.
 */
function SearchPageContent({ initialQuery }: SearchPageContentProps) {
  const [query, setQuery] = useState(initialQuery);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const router = useRouter();
  const recentSearches = useRecentSearchesStore((state) => state.queries);
  const addRecentSearch = useRecentSearchesStore((state) => state.add);
  const removeRecentSearch = useRecentSearchesStore((state) => state.remove);
  const clearRecentSearches = useRecentSearchesStore((state) => state.clear);

  useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = query.trim();
      const url = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search";
      router.replace(url, { scroll: false });
      if (trimmed) addRecentSearch(trimmed);
    }, 500);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, router]);

  const results = useMemo(() => searchProducts(query), [query]);
  const trimmedQuery = query.trim();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-hairline pb-8">
        <span className="font-mono text-overline uppercase tracking-widest text-muted-foreground">
          Search
        </span>
        <div className="flex items-center gap-3 border-b border-hairline pb-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for pieces, collections, fabrics…"
            autoFocus
            className="w-full bg-transparent font-display text-heading-lg text-ink placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
        <span className="font-mono text-caption text-muted-foreground">
          {trimmedQuery
            ? `${results.length} ${results.length === 1 ? "result" : "results"} for "${trimmedQuery}"`
            : "Start typing to search the full catalog"}
        </span>
      </div>

      {!trimmedQuery ? (
        recentSearches.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
                Recent Searches
              </span>
              <button type="button" onClick={clearRecentSearches} className="text-caption text-muted-foreground hover:text-ink">
                Clear
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {recentSearches.map((recent) => (
                <li key={recent}>
                  <button
                    type="button"
                    onClick={() => setQuery(recent)}
                    className="group flex items-center gap-1.5 rounded-pill border border-hairline px-3 py-1.5 text-caption text-ink transition-colors hover:border-brass"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    {recent}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove "${recent}" from recent searches`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeRecentSearch(recent);
                      }}
                      className="ml-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <SearchIcon className="h-7 w-7" aria-hidden="true" />
            <p className="text-body-sm">Search by product name, collection, category, or fabric.</p>
          </div>
        )
      ) : (
        <ProductGrid
          products={results}
          onQuickView={setQuickViewProduct}
          emptyState={
            <EmptyState
              icon={SearchX}
              title={`No results for "${trimmedQuery}"`}
              description="Try a different collection, category, or fabric name — or browse the full catalog below."
              action={{ label: "Browse Collections", href: ROUTES.collections }}
            />
          }
        />
      )}

      <QuickViewDialog product={quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)} />
    </div>
  );
}

export { SearchPageContent };
