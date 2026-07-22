"use client";

import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/api/products.service";

export function useNewArrivals(limit = 4) {
  return useQuery({
    queryKey: ["public-products", "new-arrivals", limit],
    queryFn: () => productsService.list({ newArrivals: true, perPage: limit }),
    staleTime: 5 * 60 * 1000,
  });
}