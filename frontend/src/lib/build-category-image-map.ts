import type { AdminCategory } from "@/types/admin/category";

export function buildCategoryImageMap(categories: AdminCategory[]): Record<string, string> {
  const map: Record<string, string> = {};

  function walk(nodes: AdminCategory[]): void {
    for (const category of nodes) {
      if (category.imageUrl) map[category.slug] = category.imageUrl;
      if (category.children?.length) walk(category.children);
    }
  }

  walk(categories);
  return map;
}