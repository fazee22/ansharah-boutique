"use client";

import { useCategoryTree } from "@/hooks/admin/use-admin-categories";
import { flattenCategoryTree, indentLabel } from "@/lib/admin/category-tree-utils";

export interface CategorySelectProps {
  id?: string;
  value: number | null;
  onChange: (categoryId: number | undefined) => void;
  /** Only leaf categories are valid product categories — a product can't belong to "Winter Collection" itself, only to a specific fabric under it. Defaults to true. */
  leavesOnly?: boolean;
  /** Adds an "All Categories" option that clears the selection — used by the filter bar, never by the product form (where a category is required). */
  allowAll?: boolean;
  className?: string;
}

/**
 * Native `<select>` with each option indented by tree depth (e.g.
 * "—  —  Khaddar") — reused by the product form, the bulk "change
 * category" action, and the products list's category filter. A
 * native select over a custom listbox for the same reasons documented
 * on `components/collections/sort-dropdown.tsx`: free keyboard/
 * screen-reader support and the OS picker on mobile.
 */
function CategorySelect({ id, value, onChange, leavesOnly = true, allowAll = false, className }: CategorySelectProps) {
  const { data: tree, isLoading } = useCategoryTree();
  const options = flattenCategoryTree(tree ?? []).filter(
    (entry) => !leavesOnly || !entry.category.children?.length,
  );

  return (
    <select
      id={id}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)}
      disabled={isLoading}
      className={
        className ??
        "h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      }
    >
      {allowAll ? (
        <option value="">All Categories</option>
      ) : (
        <option value="" disabled>
          {isLoading ? "Loading categories…" : "Select a category"}
        </option>
      )}
      {options.map(({ category, depth }) => (
        <option key={category.id} value={category.id}>
          {indentLabel(category.name, depth)}
        </option>
      ))}
    </select>
  );
}

export { CategorySelect };
