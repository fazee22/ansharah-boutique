"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/api/categories.service";
import { buildCategoryImageMap } from "@/lib/build-category-image-map";

export function useCategoryImageMap(): Record<string, string> {
  const { data } = useQuery({
    queryKey: ["public-categories", "tree"],
    queryFn: () => categoriesService.tree(),
    staleTime: 30 * 1000,
  });

  return useMemo(() => (data ? buildCategoryImageMap(data) : {}), [data]);
}