import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-body text-body-sm font-medium tracking-wide",
    "transition-all duration-400 ease-luxury-ease",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-porcelain hover:bg-ink/90 active:bg-ink/80 shadow-subtle hover:shadow-soft",
        secondary:
          "bg-evergreen text-porcelain hover:bg-evergreen-light shadow-subtle hover:shadow-soft",
        outline:
          "border border-ink bg-transparent text-ink hover:bg-ink hover:text-porcelain",
        ghost: "bg-transparent text-ink hover:bg-ink/5",
        brass:
          "bg-brass text-ink hover:bg-brass-dark hover:text-porcelain shadow-subtle hover:shadow-soft",
        link: "bg-transparent p-0 text-ink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded px-4 text-caption",
        md: "h-11 rounded-md px-6",
        lg: "h-12 rounded-md px-8 text-body-md",
        icon: "h-11 w-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const VARIANT_STYLE_OVERRIDE: Partial<Record<NonNullable<VariantProps<typeof buttonVariants>["variant"]>, React.CSSProperties>> = {
  primary: { backgroundColor: "#14140f", color: "#ffffff" },
  secondary: { backgroundColor: "#1f3a30", color: "#ffffff" },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, style, ...props }, ref) => {
    const resolvedVariant = variant ?? "primary";
    const colorStyle = VARIANT_STYLE_OVERRIDE[resolvedVariant];
    const mergedStyle = colorStyle ? { ...colorStyle, ...style } : style;

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          style={mergedStyle}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        style={mergedStyle}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };