"use client";

import { useQuery } from "@tanstack/react-query";
import { slidesService } from "@/services/api/slides.service";

export function useHeroSlides() {
  return useQuery({
    queryKey: ["public-slides", "hero"],
    queryFn: () => slidesService.list("hero"),
    staleTime: 5 * 60 * 1000,
  });
}