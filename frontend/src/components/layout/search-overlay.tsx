"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight, Clock, SearchX } from "lucide-react";
import { Container } from "@/components/shared/container";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { HighlightText } from "@/components/shared/highlight-text";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useRecentSearchesStore } from "@/store/recent-searches-store";
import { searchProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

export interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const RESULT_LIMIT = 5;

/**
 * Expanding search panel anchored under the header. Live results run
 * against the in-memory mock catalog (`lib/products.ts:searchProducts`)
 * on every keystroke — genuinely instant since there's no network
 * round-trip, not a debounced approximation of instant. Swapping in a
 * real search endpoint later means `searchProducts` becomes async and
 * this component adds a loading state; the UI shell doesn't change.
 *
 * Phase 8 additions: recent searches (shown when the input is empty),
 * matched-keyword highlighting in results, and a premium no-results
 * state instead of a single line of text.
 */
function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const recentSearches = useRecentSearchesStore((state) => state.queries);
  const addRecentSearch = useRecentSearchesStore((state) => state.add);
  const removeRecentSearch = useRecentSearchesStore((state) => state.remove);

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  const results = useMemo(() => searchProducts(query, RESULT_LIMIT), [query]);
  const trimmedQuery = query.trim();

  function goToFullResults(searchTerm: string = trimmedQuery) {
    if (!searchTerm) return;
    addRecentSearch(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-full z-40 overflow-hidden border-t border-hairline bg-porcelain shadow-elevated"
        >
          <Container>
            <form
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                goToFullResults();
              }}
              className="flex items-center gap-4 py-6"
            >
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for pieces, collections, fabrics…"
                className="w-full bg-transparent font-display text-heading-md text-ink placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="rounded-md p-2 text-ink transition-colors hover:bg-ink/5"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>

            {trimmedQuery ? (
              <div className="border-t border-hairline pb-8 pt-4">
                {results.length > 0 ? (
                  <>
                    <ul className="flex flex-col divide-y divide-hairline">
                      {results.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={ROUTES.product(product.slug)}
                            onClick={() => {
                              addRecentSearch(trimmedQuery);
                              onClose();
                            }}
                            className="group flex items-center gap-4 py-3"
                          >
                            <MediaPlaceholder
                              ratio="square"
                              tone={product.images[0]?.tone}
                              label={product.name}
                              className="h-14 w-14 shrink-0 rounded-md"
                            />
                            <div className="flex flex-1 flex-col">
                              <span className="text-body-sm text-ink transition-colors group-hover:text-brass-dark">
                                <HighlightText text={product.name} query={trimmedQuery} />
                              </span>
                              <span className="font-mono text-caption text-muted-foreground">
                                <HighlightText text={product.collectionLabel} query={trimmedQuery} />
                              </span>
                            </div>
                            <span className="font-mono text-body-sm text-ink">
                              {formatCurrency(product.salePrice ?? product.price)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => goToFullResults()}
                      className="mt-4 flex items-center gap-2 font-mono text-caption uppercase tracking-widest text-brass-dark hover:underline"
                    >
                      View All Results
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <SearchX className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    <p className="text-body-sm text-muted-foreground">
                      No pieces match &ldquo;{trimmedQuery}&rdquo;. Try a collection or fabric name.
                    </p>
                  </div>
                )}
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="border-t border-hairline py-5">
                <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
                  Recent Searches
                </span>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {recentSearches.map((recent) => (
                    <li key={recent}>
                      <button
                        type="button"
                        onClick={() => goToFullResults(recent)}
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
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.stopPropagation();
                              removeRecentSearch(recent);
                            }
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
            ) : null}
          </Container>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { SearchOverlay };
