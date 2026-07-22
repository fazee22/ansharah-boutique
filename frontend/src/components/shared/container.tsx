import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "narrow" | "wide" | "full";

const widthClass: Record<ContainerWidth, string> = {
  default: "max-w-content",
  narrow: "max-w-prose",
  wide: "max-w-[1680px]",
  full: "max-w-none",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  as?: React.ElementType;
}

/**
 * The single horizontal-rhythm primitive for the site. Every section
 * that needs consistent side gutters and a max content width wraps
 * its content in this component instead of repeating
 * `mx-auto max-w-* px-*` throughout the codebase.
 */
function Container({ width = "default", as: Tag = "div", className, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full px-gutter sm:px-8 lg:px-12", widthClass[width], className)}
      {...props}
    />
  );
}

export { Container };
