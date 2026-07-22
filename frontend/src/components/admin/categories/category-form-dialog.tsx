"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateCategory, useUpdateCategory, useUploadCategoryImage } from "@/hooks/admin/use-admin-categories";
import type { AdminCategory, CategoryFormValues } from "@/types/admin/category";

export interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AdminCategory;
  defaultParentId?: number | null;
  parentLabel?: string;
}

const emptyValues = (parentId: number | null = null): CategoryFormValues => ({
  parentId,
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  isVisible: true,
});

function CategoryFormDialog({ open, onOpenChange, category, defaultParentId = null, parentLabel }: CategoryFormDialogProps) {
  const [values, setValues] = useState<CategoryFormValues>(() =>
    category
      ? {
          parentId: category.parentId,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          imageUrl: category.imageUrl ?? "",
          isVisible: category.isVisible,
        }
      : emptyValues(defaultParentId),
  );

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const uploadImage = useUploadCategoryImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSaving = createCategory.isPending || updateCategory.isPending;

  useEffect(() => {
    if (!open) return;
    setValues(
      category
        ? {
            parentId: category.parentId,
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            imageUrl: category.imageUrl ?? "",
            isVisible: category.isVisible,
          }
        : emptyValues(defaultParentId),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category?.id, defaultParentId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim()) return;

    const onSuccess = () => onOpenChange(false);

    if (category) {
      updateCategory.mutate({ id: category.id, values }, { onSuccess });
    } else {
      createCategory.mutate(values, { onSuccess });
    }
  }

  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !category) return;

    uploadImage.mutate(
      { id: category.id, file },
      { onSuccess: (updated) => setValues((current) => ({ ...current, imageUrl: updated.imageUrl ?? "" })) },
    );
    event.target.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={category ? "Edit Category" : "Add Category"} showHeader className="max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <h2 className="font-display text-heading-md text-foreground">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          {parentLabel ? (
            <p className="text-caption text-muted-foreground">Under: {parentLabel}</p>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-caption uppercase tracking-wide text-muted-foreground">Image</label>
            {category ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadImage.isPending}
                  className="flex h-32 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-hairline bg-canvas transition-colors hover:border-brass disabled:opacity-60"
                >
                  {values.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin image preview, arbitrary Cloudinary URL
                    <img src={values.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex flex-col items-center gap-1.5 text-caption text-muted-foreground">
                      <ImagePlus className="h-5 w-5" aria-hidden="true" />
                      {uploadImage.isPending ? "Uploading…" : "Click to upload"}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <p className="rounded-md border border-dashed border-hairline bg-canvas p-3 text-caption text-muted-foreground">
                Save this category first, then an image upload option will appear here.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-name" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Name
            </label>
            <input
              id="category-name"
              autoFocus
              required
              value={values.name}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
              className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-slug" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Slug <span className="normal-case text-muted-foreground/70">(optional — auto-generated)</span>
            </label>
            <input
              id="category-slug"
              value={values.slug}
              onChange={(event) => setValues((current) => ({ ...current, slug: event.target.value }))}
              className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-description" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
              Description
            </label>
            <textarea
              id="category-description"
              rows={3}
              value={values.description}
              onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
              className="rounded-md border border-hairline bg-canvas p-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-ink">
            <input
              type="checkbox"
              checked={values.isVisible}
              onChange={(event) => setValues((current) => ({ ...current, isVisible: event.target.checked }))}
              className="h-4 w-4 accent-brass"
            />
            Visible on the storefront
          </label>

          <div className="mt-2 flex gap-3">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="flex-1">
              {category ? "Save Changes" : "Create Category"}
            </Button>
            <Button type="button" variant="outline" size="md" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CategoryFormDialog };