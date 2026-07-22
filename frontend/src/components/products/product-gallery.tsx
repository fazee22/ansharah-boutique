"use client";

import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { useImageGallery } from "@/hooks/use-image-gallery";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  onOpenLightbox: (index: number) => void;
}

function ProductGallery({ images, productName, onOpenLightbox }: ProductGalleryProps) {
  const { activeIndex, goTo, handleDragEnd } = useImageGallery({ count: images.length });
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex];

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
      <div
        role="tablist"
        aria-label={`${productName} images`}
        className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible"
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`View image ${index + 1} of ${images.length}`}
            onClick={() => goTo(index)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:h-20 sm:w-20",
              index === activeIndex ? "border-brass" : "border-transparent hover:border-hairline",
            )}
          >
            {image.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- real, admin-uploaded product photo
              <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
            ) : (
              <MediaPlaceholder ratio="square" tone={image.tone} label={image.alt} className="h-full w-full" />
            )}
          </button>
        ))}
      </div>

      <div
        ref={frameRef}
        className="group/gallery relative order-1 flex-1 cursor-zoom-in overflow-hidden rounded-lg sm:order-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => onOpenLightbox(activeIndex)}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="relative aspect-[3/4] w-full touch-pan-y"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeImage?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {activeImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element -- real, admin-uploaded product photo
                <img
                  src={activeImage.url}
                  alt={activeImage.alt ?? productName}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-300 ease-out",
                    zoom && "scale-150",
                  )}
                  style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                />
              ) : (
                <MediaPlaceholder
                  ratio="portrait"
                  tone={activeImage?.tone}
                  label={activeImage?.alt ?? productName}
                  className={cn(
                    "h-full w-full transition-transform duration-300 ease-out",
                    zoom && "scale-150",
                  )}
                  style={
                    zoom
                      ? { transformOrigin: `${zoom.x}% ${zoom.y}%` }
                      : undefined
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-caption text-porcelain opacity-0 backdrop-blur transition-opacity duration-300 group-hover/gallery:opacity-100">
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          Click to expand
        </span>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[0.6875rem] text-porcelain backdrop-blur">
          {activeIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}

export { ProductGallery };