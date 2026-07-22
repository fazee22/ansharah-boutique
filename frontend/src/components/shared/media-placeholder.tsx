import * as React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface MediaPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Short caption rendered faintly in the corner, e.g. a collection or slide name. */
  label?: string;
  ratio?: "portrait" | "square" | "landscape" | "wide";
  tone?: "canvas" | "evergreen" | "ink";
}

const ratioClass: Record<NonNullable<MediaPlaceholderProps["ratio"]>, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

const toneClass: Record<NonNullable<MediaPlaceholderProps["tone"]>, string> = {
  canvas: "from-stone/70 via-canvas to-stone/40 text-ink/25",
  evergreen: "from-evergreen-light/40 via-evergreen to-evergreen-dark text-porcelain/20",
  ink: "from-ink/80 via-ink to-ink/60 text-porcelain/15",
};

/**
 * Stand-in for real photography anywhere the design calls for a
 * product/campaign/social image — hero slides, collection cards,
 * product previews, the Instagram grid. Deliberately a single,
 * reusable component (not an `<img>` with a broken `src`) so that
 * wiring up real Cloudinary imagery later is a one-file change:
 * swap this component's internals for a `next/image`, and every
 * call site that renders `<MediaPlaceholder />` gets a real photo
 * with no other code touched.
 *
 * Renders a soft brand-toned gradient with a faint diagonal weave
 * pattern and monogram initial — reads as an intentional, elegant
 * placeholder rather than a missing asset.
 */
function MediaPlaceholder({
  label,
  ratio = "portrait",
  tone = "canvas",
  className,
  children,
  ...props
}: MediaPlaceholderProps) {
  const patternId = `weave-${useId()}`;

  return (
    <div
      role="img"
      aria-label={label ? `${label} — image coming soon` : "Image coming soon"}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        ratioClass[ratio],
        toneClass[tone],
        className,
      )}
      {...props}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={patternId} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <span className="font-display text-display-lg font-light" aria-hidden="true">
        V
      </span>

      {children}
    </div>
  );
}

export { MediaPlaceholder };
