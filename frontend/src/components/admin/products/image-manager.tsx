"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, Star, Trash2, ImageOff, Loader2 } from "lucide-react";
import {
  useUploadProductImage,
  useDeleteProductImage,
  useSetFeaturedImage,
  useReorderProductImages,
} from "@/hooks/admin/use-admin-product-images";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import type { AdminProductImage } from "@/types/admin/product";

export interface ImageManagerProps {
  productId: number;
  images: AdminProductImage[];
}

const MIN_RECOMMENDED_IMAGES = 4;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * The product image workflow end to end: drag-and-drop (or click-to-
 * browse) upload straight to the real Cloudinary-backed endpoint,
 * drag-to-reorder over the existing grid (native HTML5 drag events —
 * no DnD library needed for a single-axis grid reorder), a star
 * button to choose the featured image, and per-image delete. Backed
 * entirely by `backend/app/Services/ProductImageService` — nothing
 * here is simulated.
 */
function ImageManager({ productId, images }: ImageManagerProps) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useUploadProductImage(productId);
  const remove = useDeleteProductImage(productId);
  const setFeatured = useSetFeaturedImage(productId);
  const reorder = useReorderProductImages(productId);

  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => ACCEPTED_TYPES.includes(file.type));
    const rejected = Array.from(fileList).length - files.length;
    if (rejected > 0) {
      toast(`${rejected} file(s) skipped — only JPEG, PNG, or WebP images are supported.`, "error");
    }

    files.forEach((file) => {
      setUploadingCount((count) => count + 1);
      upload.mutate(
        { file },
        {
          onSettled: () => setUploadingCount((count) => count - 1),
        },
      );
    });
  }

  function handleDropFiles(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(false);
    if (event.dataTransfer.files.length) uploadFiles(event.dataTransfer.files);
  }

  function handleImageDragStart(imageId: number) {
    setDraggedImageId(imageId);
  }

  function handleImageDrop(targetId: number) {
    if (draggedImageId === null || draggedImageId === targetId) {
      setDraggedImageId(null);
      return;
    }

    const reordered = [...sortedImages];
    const fromIndex = reordered.findIndex((image) => image.id === draggedImageId);
    const toIndex = reordered.findIndex((image) => image.id === targetId);
    const [moved] = reordered.splice(fromIndex, 1);
    if (moved) reordered.splice(toIndex, 0, moved);

    reorder.mutate(reordered.map((image, index) => ({ id: image.id, position: index + 1 })));
    setDraggedImageId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDropFiles}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => event.key === "Enter" && fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDraggingFile ? "border-brass bg-brass/5" : "border-hairline hover:border-ink/30",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-body-sm text-ink">
          <span className="text-brass-dark">Click to upload</span> or drag and drop
        </p>
        <p className="text-caption text-muted-foreground">JPEG, PNG, or WebP — up to 8MB each</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && uploadFiles(event.target.files)}
        />
      </div>

      {sortedImages.length < MIN_RECOMMENDED_IMAGES ? (
        <p className="text-caption text-brass-dark">
          Add at least {MIN_RECOMMENDED_IMAGES} images ({sortedImages.length}/{MIN_RECOMMENDED_IMAGES} so far) —
          the storefront gallery is designed around a minimum of four.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sortedImages.map((image) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleImageDragStart(image.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleImageDrop(image.id)}
            className={cn(
              "group relative aspect-square cursor-grab overflow-hidden rounded-md border-2 active:cursor-grabbing",
              image.isFeatured ? "border-brass" : "border-hairline",
              draggedImageId === image.id && "opacity-40",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary asset, not a storefront image */}
            <img src={image.url} alt="" className="h-full w-full object-cover" />

            {image.isFeatured ? (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-pill bg-brass px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wide text-ink">
                <Star className="h-2.5 w-2.5 fill-ink" aria-hidden="true" />
                Featured
              </span>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-ink/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              {!image.isFeatured ? (
                <button
                  type="button"
                  aria-label="Set as featured image"
                  onClick={() => setFeatured.mutate(image.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-porcelain/90 text-ink hover:bg-porcelain"
                >
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Delete image"
                onClick={() => remove.mutate(image.id)}
                disabled={sortedImages.length <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-porcelain/90 text-ink hover:bg-destructive hover:text-destructive-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        {Array.from({ length: uploadingCount }, (_, index) => (
          <div
            key={`uploading-${index}`}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-hairline bg-porcelain text-muted-foreground"
          >
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="text-caption">Uploading…</span>
          </div>
        ))}

        {sortedImages.length === 0 && uploadingCount === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <ImageOff className="h-6 w-6" aria-hidden="true" />
            <span className="text-caption">No images yet</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { ImageManager };
