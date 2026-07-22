import type { AdminCategory } from "@/types/admin/category";

export interface FlatCategoryOption {
  category: AdminCategory;
  depth: number;
}

/**
 * Flattens the admin category tree (as returned by `?tree=1`) into an
 * ordered, depth-annotated list — what every category `<select>` in
 * the admin (product form, bulk "change category," filters) actually
 * needs: a single flat list it can indent by `depth`, not a tree it
 * would have to walk itself.
 */
export function flattenCategoryTree(tree: AdminCategory[], depth: number = 0): FlatCategoryOption[] {
  return tree.flatMap((category) => [
    { category, depth },
    ...flattenCategoryTree(category.children ?? [], depth + 1),
  ]);
}

/** `"— — Embroidered Lawn"` style indentation prefix for a flat `<option>` label. */
export function indentLabel(name: string, depth: number): string {
  return depth === 0 ? name : `${"—  ".repeat(depth)}${name}`;
}

/** True if `candidateId` is `nodeId` itself or a descendant of it — used to stop a category from being moved under its own subtree in the UI (the backend enforces this too; see `CategoryService::assertNotSelfOrDescendant`). */
export function isSelfOrDescendant(tree: AdminCategory[], nodeId: number, candidateId: number): boolean {
  const node = flattenCategoryTree(tree).find((entry) => entry.category.id === nodeId)?.category;
  if (!node) return false;
  if (node.id === candidateId) return true;
  return (node.children ?? []).some((child) => isSelfOrDescendant([child], child.id, candidateId));
}
