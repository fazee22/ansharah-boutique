"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { productsService } from "@/services/api/products.service";
import { ProductRow } from "./product-row";

export interface RecentlyViewedRowProps {
  currentProductId: string;
}

function RecentlyViewedRow({ currentProductId }: RecentlyViewedRowProps) {
  const productIds = useRecentlyViewedStore((state) => state.productIds);
  const record = useRecentlyViewedStore((state) => state.record);

  useEffect(() => {
    record(currentProductId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProductId]);

  const idsToFetch = productIds.filter((id) => id !== currentProductId);

  const { data: products } = useQuery({
    queryKey: ["recently-viewed-products", idsToFetch],
    queryFn: () => productsService.list({ ids: idsToFetch }),
    enabled: idsToFetch.length > 0,
    staleTime: 60 * 1000,
  });

  if (idsToFetch.length === 0) return null;

  return <ProductRow eyebrow="Your History" title="Recently Viewed" products={products ?? []} />;
}

export { RecentlyViewedRow };