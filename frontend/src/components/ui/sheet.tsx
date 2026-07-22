"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Slide-in panel used by the mobile navigation drawer (and reusable
 * later for a filters panel, cart drawer, etc). Built on Radix
 * Dialog for focus-trapping, outside-click, and Escape-to-close
 * behavior — the "luxury slide-in menu" motion is layered on top via
 * Tailwind's data-state animations.
 */
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]",
      "data-[state=open]:animate-fade-in data-[state=closed]:opacity-0",
      "transition-opacity duration-400 ease-luxury-ease",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-0 bg-porcelain shadow-floating transition-transform duration-400 ease-luxury-ease",
  {
    variants: {
      side: {
        left: "inset-y-0 left-0 h-full w-full max-w-sm -translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
        right:
          "inset-y-0 right-0 h-full w-full max-w-sm translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
        top: "inset-x-0 top-0 w-full -translate-y-full data-[state=open]:translate-y-0",
        bottom: "inset-x-0 bottom-0 w-full translate-y-full data-[state=open]:translate-y-0",
      },
    },
    defaultVariants: { side: "left" },
  },
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  title: string;
  description?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side, className, children, title, description, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <VisuallyHidden asChild>
        <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
      </VisuallyHidden>
      {description ? (
        <VisuallyHidden asChild>
          <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
        </VisuallyHidden>
      ) : null}
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-2 text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">
        <X className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Close menu</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetClose, SheetContent };
