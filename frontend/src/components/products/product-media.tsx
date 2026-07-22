"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ProductGallery } from "./product-gallery";
import type { ProductImage } from "@/types/product";

/**
 * Loaded on demand rather than bundled with every product page — most
 * visitors never open the fullscreen lightbox, so its code (and the
 * Radix Dialog primitive it pulls in) shouldn't cost anything until
 * someone actually clicks to expand an image.
 */
const ImageLightbox = dynamic(() => import("./image-lightbox").then((mod) => mod.ImageLightbox), {
  ssr: false,
});

export interface ProductMediaProps {
  images: ProductImage[];
  productName: string;
}

/** Combines `ProductGallery` and `ImageLightbox`, owning the single piece of shared state (is the lightbox open, and at which image) between them. */
function ProductMedia({ images, productName }: ProductMediaProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <ProductGallery images={images} productName={productName} onOpenLightbox={setLightboxIndex} />
      {lightboxIndex !== null ? (
        <ImageLightbox
          images={images}
          productName={productName}
          open={lightboxIndex !== null}
          initialIndex={lightboxIndex ?? 0}
          onOpenChange={(open) => !open && setLightboxIndex(null)}
        />
      ) : null}
    </>
  );
}

export { ProductMedia };
