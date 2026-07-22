"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, Trash2, GripVertical, Loader2, Pencil, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  useSlideList,
  useUploadSlide,
  useUpdateSlide,
  useDeleteSlide,
  useToggleSlideActive,
  useReorderSlides,
} from "@/hooks/admin/use-admin-slides";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import type { AdminSlide, SlideType } from "@/types/admin/slide";

export interface SlideManagerProps {
  type: SlideType;
  /** Hero slides show title/subtitle/CTA fields (they're headline banners); marquee slides skip them (they're a scrolling image strip, not editorial copy) — same manager, tuned by this flag. */
  showEditorialFields?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function SlideEditForm({ slide, type, onDone }: { slide: AdminSlide; type: SlideType; onDone: () => void }) {
  const [title, setTitle] = useState(slide.title ?? "");
  const [subtitle, setSubtitle] = useState(slide.subtitle ?? "");
  const [linkUrl, setLinkUrl] = useState(slide.linkUrl ?? "");
  const [ctaLabel, setCtaLabel] = useState(slide.ctaLabel ?? "");
  const update = useUpdateSlide(type);

  function handleSave() {
    update.mutate(
      { id: slide.id, fields: { title, subtitle, linkUrl, ctaLabel } },
      { onSuccess: onDone },
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t border-hairline p-3">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
        className="h-9 rounded-md border border-hairline bg-canvas px-2 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      />
      <input
        value={subtitle}
        onChange={(event) => setSubtitle(event.target.value)}
        placeholder="Subtitle"
        className="h-9 rounded-md border border-hairline bg-canvas px-2 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      />
      <div className="flex gap-2">
        <input
          value={linkUrl}
          onChange={(event) => setLinkUrl(event.target.value)}
          placeholder="Link URL"
          className="h-9 flex-1 rounded-md border border-hairline bg-canvas px-2 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
        <input
          value={ctaLabel}
          onChange={(event) => setCtaLabel(event.target.value)}
          placeholder="Button label"
          className="h-9 w-32 rounded-md border border-hairline bg-canvas px-2 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={update.isPending}
          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-ink text-caption text-porcelain hover:bg-ink/90"
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Save
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:bg-ink/5"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SlideManager({ type, showEditorialFields = true }: SlideManagerProps) {
  const { data: slides, isLoading } = useSlideList(type);
  const upload = useUploadSlide(type);
  const remove = useDeleteSlide(type);
  const toggleActive = useToggleSlideActive(type);
  const reorder = useReorderSlides(type);

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sorted = [...(slides ?? [])].sort((a, b) => a.position - b.position);

  function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => ACCEPTED_TYPES.includes(file.type));
    if (files.length < Array.from(fileList).length) {
      toast("Only JPEG, PNG, or WebP images are supported.", "error");
    }
    files.forEach((file) => {
      setUploadingCount((count) => count + 1);
      upload.mutate({ file }, { onSettled: () => setUploadingCount((count) => count - 1) });
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(false);
    if (event.dataTransfer.files.length) uploadFiles(event.dataTransfer.files);
  }

  function handleSlideDrop(targetId: number) {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const reordered = [...sorted];
    const fromIndex = reordered.findIndex((s) => s.id === draggedId);
    const toIndex = reordered.findIndex((s) => s.id === targetId);
    const [moved] = reordered.splice(fromIndex, 1);
    if (moved) reordered.splice(toIndex, 0, moved);
    reorder.mutate(reordered.map((s, index) => ({ id: s.id, position: index + 1 })));
    setDraggedId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDrop}
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

      {isLoading ? (
        <p className="text-caption text-muted-foreground">Loading slides…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((slide) => (
            <div
              key={slide.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-lg border",
                slide.isActive ? "border-hairline" : "border-hairline opacity-50",
                draggedId === slide.id && "opacity-40",
              )}
            >
              <div
                draggable
                onDragStart={() => setDraggedId(slide.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleSlideDrop(slide.id)}
                className="group relative aspect-[16/9] cursor-grab active:cursor-grabbing"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded Cloudinary asset */}
                <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-porcelain opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-ink/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label="Edit slide"
                    onClick={() => setEditingId(slide.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-porcelain/90 text-ink hover:bg-porcelain"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete slide"
                    onClick={() => remove.mutate(slide.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-porcelain/90 text-ink hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {editingId === slide.id ? (
                <SlideEditForm slide={slide} type={type} onDone={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center justify-between p-3">
                  <div className="flex flex-col overflow-hidden">
                    {showEditorialFields ? (
                      <>
                        <span className="truncate text-caption text-ink">{slide.title || "Untitled"}</span>
                        <span className="truncate text-[0.6875rem] text-muted-foreground">
                          {slide.subtitle || "No subtitle"}
                        </span>
                      </>
                    ) : (
                      <span className="truncate text-caption text-ink">{slide.title || `Slide ${slide.position}`}</span>
                    )}
                  </div>
                  <label className="flex shrink-0 items-center gap-2">
                    <span className="text-[0.6875rem] text-muted-foreground">{slide.isActive ? "On" : "Off"}</span>
                    <Switch checked={slide.isActive} onCheckedChange={() => toggleActive.mutate(slide.id)} />
                  </label>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: uploadingCount }, (_, index) => (
            <div
              key={`uploading-${index}`}
              className="flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-hairline bg-porcelain text-muted-foreground"
            >
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span className="text-caption">Uploading…</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { SlideManager };
