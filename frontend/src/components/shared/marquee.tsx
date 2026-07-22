"use client";

import { Fragment, type ReactNode } from "react";
import { useMarquee, type UseMarqueeOptions } from "@/hooks/use-marquee";
import { cn } from "@/lib/utils";

export interface MarqueeProps<T> extends UseMarqueeOptions {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  trackClassName?: string;
  /** Full Tailwind gap class, e.g. "gap-6" (default) or "gap-10". */
  gap?: string;
}

/**
 * Generic, reusable infinite auto-scroll marquee — the "Ramsha
 * Inspired Auto Moving Collection Slider." Content-agnostic (renders
 * whatever `renderItem` returns), so this same component can carry
 * collection chips on the homepage today and, unchanged, carry
 * brand/press logos or reviews elsewhere later.
 *
 * `items` is rendered twice back-to-back internally — the seamless-
 * loop trick documented in `useMarquee` — so callers only ever pass
 * one logical set of items and never think about the duplication.
 */
function Marquee<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  trackClassName,
  gap = "gap-6",
  ...marqueeOptions
}: MarqueeProps<T>) {
  const { trackRef, handlers, isDragging } = useMarquee(marqueeOptions);

  return (
    <div
      className={cn("group/marquee relative w-full overflow-hidden", className)}
      {...handlers}
    >
      {/* Edge fade masks — signal there's more content beyond the viewport
          without a hard visual cut, a small but distinctly "premium" detail. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[hsl(var(--background))] to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[hsl(var(--background))] to-transparent sm:w-28"
      />

      <div
        ref={trackRef}
        className={cn(
          "flex w-max touch-pan-y select-none will-change-transform",
          gap,
          isDragging ? "cursor-grabbing" : "cursor-grab",
          trackClassName,
        )}
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item, index) => (
              <div key={`${copy}-${keyExtractor(item, index)}`} inert={copy === 1 || undefined}>
                {renderItem(item, index)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export { Marquee };
