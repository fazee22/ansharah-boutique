"use client";

import { useState } from "react";
import { X, Trash2, Eye, EyeOff, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "./category-select";
import type { BulkProductAction } from "@/types/admin/product";

export interface BulkActionsBarProps {
  selectedCount: number;
  onAction: (action: BulkProductAction, categoryId?: number) => void;
  onClearSelection: () => void;
  isPending: boolean;
}

/**
 * Appears above the table once at least one row is selected — bulk
 * publish/draft/hide/delete plus a category-change picker. One bulk
 * action covers both "Bulk Category Change" and "Bulk Collection
 * Change" from the brief, since Category and Collection are the same
 * underlying tree (see `backend`'s `Category` model doc comment).
 */
function BulkActionsBar({ selectedCount, onAction, onClearSelection, isPending }: BulkActionsBarProps) {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brass/30 bg-brass/5 px-4 py-3">
      <span className="font-mono text-caption uppercase tracking-wide text-brass-dark">
        {selectedCount} selected
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" disabled={isPending} onClick={() => onAction("publish")}>
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Publish
        </Button>
        <Button variant="outline" size="sm" disabled={isPending} onClick={() => onAction("draft")}>
          <FileEdit className="h-3.5 w-3.5" aria-hidden="true" />
          Set Draft
        </Button>
        <Button variant="outline" size="sm" disabled={isPending} onClick={() => onAction("hide")}>
          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          Hide
        </Button>

        {showCategoryPicker ? (
          <CategorySelect
            value={null}
            onChange={(categoryId) => {
              if (categoryId) {
                onAction("change_category", categoryId);
                setShowCategoryPicker(false);
              }
            }}
            className="h-9 rounded-md border border-hairline bg-canvas px-2 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          />
        ) : (
          <Button variant="outline" size="sm" disabled={isPending} onClick={() => setShowCategoryPicker(true)}>
            Change Category
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => onAction("delete")}
          className="border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </Button>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        aria-label="Clear selection"
        className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export { BulkActionsBar };
