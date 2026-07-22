import { TrendingUp } from "lucide-react";

/**
 * A deliberately honest placeholder — not a real chart wired to fake
 * numbers. The Phase 6 brief explicitly asks for "Beautiful Charts
 * placeholders (backend integration ready)" since revenue/order
 * time-series data doesn't exist until Phase 7's Orders module. A
 * bar-shaped SVG silhouette signals "a chart will render here" far
 * more honestly than plotting a real chart against invented numbers
 * would. No charting library dependency is added until there's real
 * data to feed it.
 */
function ChartPlaceholder() {
  const bars = [38, 52, 34, 61, 48, 70, 45, 58, 66, 40, 55, 72];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-display text-heading-sm text-foreground">Revenue Overview</h3>
          <p className="text-caption text-muted-foreground">Arrives with order tracking in Phase 7</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass/10 text-brass-dark">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div
        role="img"
        aria-label="Placeholder revenue chart — real data arrives once order tracking is built"
        className="flex h-40 items-end gap-2"
      >
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-brass/50 to-brass/15"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between font-mono text-[0.6875rem] uppercase tracking-wide text-muted-foreground/60">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </div>
  );
}

export { ChartPlaceholder };
