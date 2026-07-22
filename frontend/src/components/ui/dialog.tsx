"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Centered modal primitive — distinct from `Sheet` (side-anchored
 * drawer). Used by the product Quick View; reusable anywhere else a
 * centered overlay is needed later (confirmation dialogs, etc).
 */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm",
      "data-[state=open]:animate-fade-in data-[state=closed]:opacity-0",
      "transition-opacity duration-400 ease-luxury-ease",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string;
  description?: string;
  /** Renders the title/description visibly instead of screen-reader-only — Quick View wants a real visible heading. */
  showHeader?: boolean;
}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, title, description, showHeader = false, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2",
          "max-h-[85vh] overflow-y-auto rounded-lg bg-porcelain shadow-floating",
          "data-[state=open]:animate-fade-in data-[state=closed]:opacity-0",
          "transition-all duration-400 ease-luxury-ease",
          className,
        )}
        {...props}
      >
        {showHeader ? (
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        ) : (
          <VisuallyHidden asChild>
            <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          </VisuallyHidden>
        )}
        {description ? (
          <VisuallyHidden asChild>
            <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
          </VisuallyHidden>
        ) : null}
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-md p-2 text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">
          <X className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = "DialogContent";

export { Dialog, DialogTrigger, DialogClose, DialogContent };
