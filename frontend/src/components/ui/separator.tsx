import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/**
 * Plain `<div>`-based separator (no Radix primitive needed for a
 * purely decorative divider). Use `role="none"` since it carries no
 * semantic meaning beyond the visual line.
 */
function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <div
      role="none"
      className={cn(
        "shrink-0 bg-hairline",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
