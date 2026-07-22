import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Generic luxury surface card — the base for any future
 * content/product/editorial card. Deliberately unopinionated about
 * content; feature-specific cards (built in later phases) compose
 * this rather than duplicating the border/shadow/radius treatment.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group rounded-lg border border-hairline bg-card text-card-foreground",
        "shadow-subtle transition-shadow duration-400 ease-luxury-ease hover:shadow-elevated",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("aspect-[3/4] w-full overflow-hidden rounded-t-lg bg-stone/40", className)}
      {...props}
    />
  ),
);
CardMedia.displayName = "CardMedia";

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />
  ),
);
CardBody.displayName = "CardBody";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("font-display text-heading-sm text-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-body-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export { Card, CardMedia, CardBody, CardTitle, CardDescription };
