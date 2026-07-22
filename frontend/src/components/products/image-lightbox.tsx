"use client";

import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { useImageGallery } from "@/hooks/use-image-gallery";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

export interface ImageLightboxProps {
  images: ProductImage[];
  productName: string;
  open: boolean;
  initialIndex: number;
  onOpenChange: (open: boolean) => void;
}

/**
 * Fullscreen image viewer — a dedicated overlay (not the shared
 * centered `Dialog`, whose fixed max-width doesn't suit an edge-to-
 * edge viewer) built directly on Radix's Dialog primitives. Shares
 * navigation logic with `ProductGallery` via `useImageGallery`
 * (keyboard arrows, swipe) so the two never behave inconsistently;
 * only opens with `initialIndex` synced from whichever thumbnail was
 * active in the inline gallery when the user clicked to expand.
 */
function ImageLightbox({ images, productName, open, initialIndex, onOpenChange }: ImageLightboxProps) {
  const { activeIndex, goTo, next, previous, handleDragEnd } = useImageGallery({
    count: images.length,
    keyboardEnabled: open,
  });

  useEffect(() => {
    if (open) goTo(initialIndex);
    // Only re-sync when the lightbox transitions open with a new starting index — not on every `goTo` call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const activeImage = images[activeIndex];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-ink data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[70] flex flex-col outline-none"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <VisuallyHidden asChild>
            <DialogPrimitive.Title>{`${productName} — image ${activeIndex + 1} of ${images.length}`}</DialogPrimitive.Title>
          </VisuallyHidden>

          <div className="flex items-center justify-between p-4 sm:p-6">
            <span className="font-mono text-caption text-porcelain/70">
              {activeIndex + 1} / {images.length}
            </span>
            <DialogPrimitive.Close
              aria-label="Close lightbox"
              className="rounded-full p-2 text-porcelain transition-colors hover:bg-porcelain/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-16">
            <button
              type="button"
              aria-label="Previous image"
              onClick={previous}
              className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-porcelain/10 text-porcelain transition-colors hover:bg-porcelain/20 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="relative h-full w-full max-w-2xl touch-pan-y"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeImage?.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full w-full items-center justify-center"
                >
                  {activeImage?.url ? (
  // eslint-disable-next-line @next/next/no-img-element -- real, admin-uploaded product photo
  <img
    src={activeImage.url}
    alt={activeImage.alt ?? productName}
    className="max-h-[75vh] w-full rounded-md object-contain"
  />
) : (
  <MediaPlaceholder
    ratio="portrait"
    tone={activeImage?.tone}
    label={activeImage?.alt ?? productName}
    className="max-h-[75vh] w-full rounded-md"
  />
)}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-porcelain/10 text-porcelain transition-colors hover:bg-porcelain/20 sm:flex"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto p-4 sm:p-6">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full transition-all",
                  index === activeIndex ? "w-6 bg-brass" : "bg-porcelain/30 hover:bg-porcelain/50",
                )}
              />
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ImageLightbox };
