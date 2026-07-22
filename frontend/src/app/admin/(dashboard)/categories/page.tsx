"use client";

import { useState } from "react";
import { Plus, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryTree } from "@/components/admin/categories/category-tree";
import { CategoryFormDialog } from "@/components/admin/categories/category-form-dialog";
import { useCategoryTree } from "@/hooks/admin/use-admin-categories";
import type { AdminCategory } from "@/types/admin/category";

type DialogState =
  | { mode: "closed" }
  | { mode: "create"; parent?: AdminCategory }
  | { mode: "edit"; category: AdminCategory };

/**
 * Manages the single category tree that the admin UI presents as both
 * "Collections" (depth 0 — Summer/Winter/Shawls) and "Categories"
 * (everything deeper) — see `backend`'s `Category` migration for why
 * it's one tree, not two separate management surfaces.
 */
export default function AdminCategoriesPage() {
  const { data: tree, isLoading } = useCategoryTree();
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-light text-foreground">
            Categories &amp; Collections
          </h1>
          <p className="text-body-sm text-muted-foreground">
            Summer Collection, Winter Collection, Shawls, and every category beneath them — one tree.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setDialog({ mode: "create" })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Collection
        </Button>
      </div>

      <div className="rounded-lg border border-hairline bg-card p-4 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : tree && tree.length > 0 ? (
          <CategoryTree
            nodes={tree}
            onEdit={(category) => setDialog({ mode: "edit", category })}
            onAddChild={(parent) => setDialog({ mode: "create", parent })}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <FolderTree className="h-8 w-8" aria-hidden="true" />
            <p className="text-body-sm">No collections yet — add the first one to get started.</p>
          </div>
        )}
      </div>

      <CategoryFormDialog
        open={dialog.mode !== "closed"}
        onOpenChange={(open) => !open && setDialog({ mode: "closed" })}
        category={dialog.mode === "edit" ? dialog.category : undefined}
        defaultParentId={dialog.mode === "create" ? (dialog.parent?.id ?? null) : null}
        parentLabel={dialog.mode === "create" ? dialog.parent?.name : undefined}
      />
    </div>
  );
}
