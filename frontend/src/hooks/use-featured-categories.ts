"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/api/categories.service";

export function useFeaturedCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: () => categoriesService.list(),
    staleTime: 30 * 1000,
  });
}