import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

/**
 * Standalone loading indicator for non-button contexts (e.g. a panel
 * or page-section loading state). Buttons use their own built-in
 * spinner via `Button`'s `isLoading` prop instead of this component.
 */
function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-brass",
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
