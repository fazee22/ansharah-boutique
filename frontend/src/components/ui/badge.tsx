import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium uppercase tracking-widest",
  {
    variants: {
      variant: {
        brass: "bg-brass/15 text-brass-dark",
        evergreen: "bg-evergreen/10 text-evergreen",
        ink: "bg-ink text-porcelain",
        outline: "border border-hairline text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "brass",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
