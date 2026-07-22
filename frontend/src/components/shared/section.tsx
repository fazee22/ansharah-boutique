import * as React from "react";
import { Container, type ContainerProps } from "./container";
import { cn } from "@/lib/utils";

type SectionTone = "canvas" | "porcelain" | "ink" | "evergreen";
type SectionSpacing = "sm" | "md" | "lg" | "xl";

const toneClass: Record<SectionTone, string> = {
  canvas: "bg-canvas text-foreground",
  porcelain: "bg-porcelain text-foreground",
  ink: "bg-ink text-porcelain",
  evergreen: "bg-evergreen text-porcelain",
};

const spacingClass: Record<SectionSpacing, string> = {
  sm: "py-section-sm",
  md: "py-section-md",
  lg: "py-section-lg",
  xl: "py-section-xl",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  spacing?: SectionSpacing;
  containerWidth?: ContainerProps["width"];
  /** Skip the inner Container when a section needs full-bleed content (e.g. the marquee). */
  fullBleed?: boolean;
}

/**
 * The one vertical-rhythm + tone primitive for homepage (and later,
 * any long-form page) sections. Every section on the homepage wraps
 * its content in this instead of repeating `py-* bg-*` + a manual
 * `Container` — keeps spacing and background tone consistent and
 * changeable from one place.
 */
function Section({
  tone = "canvas",
  spacing = "lg",
  containerWidth,
  fullBleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(toneClass[tone], spacingClass[spacing], className)} {...props}>
      {fullBleed ? children : <Container width={containerWidth}>{children}</Container>}
    </section>
  );
}

export { Section };
