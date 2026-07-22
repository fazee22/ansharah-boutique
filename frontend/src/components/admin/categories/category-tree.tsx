"use client";

import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Package,
} from "lucide-react";
import {
  useToggleCategoryVisibility,
  useDeleteCategory,
  useReorderCategories,
} from "@/hooks/admin/use-admin-categories";
import { cn } from "@/lib/utils";
import type { AdminCategory } from "@/types/admin/category";

export interface CategoryTreeProps {
  nodes: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
  onAddChild: (parent: AdminCategory) => void;
}

/** Top-level entry point — renders each root node and its descendants recursively via `CategoryTreeNode`. */
function CategoryTree({ nodes, onEdit, onAddChild }: CategoryTreeProps) {
  const reorder = useReorderCategories();
  const [draggedId, setDraggedId] = useState<number | null>(null);

  function handleDrop(targetId: number, siblings: AdminCategory[]) {
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const ids = siblings.map((s) => s.id);
    if (!ids.includes(draggedId)) {
      setDraggedId(null);
      return;
    }

    const reordered = [...siblings];
    const fromIndex = reordered.findIndex((c) => c.id === draggedId);
    const toIndex = reordered.findIndex((c) => c.id === targetId);
    const [moved] = reordered.splice(fromIndex, 1);
    if (moved) reordered.splice(toIndex, 0, moved);

    reorder.mutate(reordered.map((category, index) => ({ id: category.id, position: index })));
    setDraggedId(null);
  }

  return (
    <ul className="flex flex-col gap-1">
      {nodes.map((node) => (
        <CategoryTreeNode
          key={node.id}
          node={node}
          depth={0}
          siblings={nodes}
          draggedId={draggedId}
          onDragStart={setDraggedId}
          onDrop={handleDrop}
          onEdit={onEdit}
          onAddChild={onAddChild}
        />
      ))}
    </ul>
  );
}

function CategoryTreeNode({
  node,
  depth,
  siblings,
  draggedId,
  onDragStart,
  onDrop,
  onEdit,
  onAddChild,
}: {
  node: AdminCategory;
  depth: number;
  siblings: AdminCategory[];
  draggedId: number | null;
  onDragStart: (id: number) => void;
  onDrop: (targetId: number, siblings: AdminCategory[]) => void;
  onEdit: (category: AdminCategory) => void;
  onAddChild: (parent: AdminCategory) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const toggleVisibility = useToggleCategoryVisibility();
  const deleteCategory = useDeleteCategory();
  const hasChildren = Boolean(node.children?.length);

  function handleDelete() {
    if (hasChildren) {
      window.alert("Move or delete its subcategories first.");
      return;
    }
    if (node.productCount) {
      window.alert(`${node.productCount} product(s) still use this category. Reassign them first.`);
      return;
    }
    if (window.confirm(`Delete "${node.name}"?`)) {
      deleteCategory.mutate(node.id);
    }
  }

  return (
    <li>
      <div
        draggable
        onDragStart={() => onDragStart(node.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => onDrop(node.id, siblings)}
        className={cn(
          "group flex items-center gap-2 rounded-md border border-transparent px-2 py-2 hover:border-hairline hover:bg-porcelain",
          draggedId === node.id && "opacity-40",
          !node.isVisible && "opacity-60",
        )}
        style={{ marginLeft: depth * 24 }}
      >
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? "Collapse" : "Expand"}
          className={cn("flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground", !hasChildren && "invisible")}
        >
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")} aria-hidden="true" />
        </button>

        <span className="flex-1 truncate text-body-sm text-ink">{node.name}</span>

        {node.productCount !== undefined ? (
          <span className="flex items-center gap-1 font-mono text-caption text-muted-foreground">
            <Package className="h-3 w-3" aria-hidden="true" />
            {node.productCount}
          </span>
        ) : null}

        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            aria-label={`Add subcategory under ${node.name}`}
            onClick={() => onAddChild(node)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Edit ${node.name}`}
            onClick={() => onEdit(node)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5 hover:text-ink"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={node.isVisible ? `Hide ${node.name}` : `Show ${node.name}`}
            onClick={() => toggleVisibility.mutate(node.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5 hover:text-ink"
          >
            {node.isVisible ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            aria-label={`Delete ${node.name}`}
            onClick={handleDelete}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {hasChildren && expanded ? (
        <ul className="flex flex-col gap-1">
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              siblings={node.children!}
              draggedId={draggedId}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onEdit={onEdit}
              onAddChild={onAddChild}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export { CategoryTree };
