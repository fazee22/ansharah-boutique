"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProductsService } from "@/services/api/admin/products.service";
import { toast } from "@/store/toast-store";
import type { BulkProductAction, ProductFormValues, ProductListFilters } from "@/types/admin/product";

export const productKeys = {
  all: ["admin", "products"] as const,
  list: (filters: ProductListFilters) => [...productKeys.all, "list", filters] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};

export function useProductList(filters: ProductListFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => adminProductsService.list(filters),
    placeholderData: (previous) => previous, // keeps the table's current page visible while the next page loads, instead of flashing to a loading skeleton on every click
  });
}

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: productKeys.detail(id ?? -1),
    queryFn: () => adminProductsService.get(id as number),
    enabled: id !== null,
  });
}

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: productKeys.all });
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (values: ProductFormValues) => adminProductsService.create(values),
    onSuccess: () => {
      invalidate();
      toast("Product created.", "success");
    },
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<ProductFormValues> }) =>
      adminProductsService.update(id, values),
    onSuccess: () => {
      invalidate();
      toast("Product updated.", "success");
    },
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id: number) => adminProductsService.remove(id),
    onSuccess: () => {
      invalidate();
      toast("Product deleted.", "success");
    },
  });
}

export function useDuplicateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id: number) => adminProductsService.duplicate(id),
    onSuccess: () => {
      invalidate();
      toast("Product duplicated as a draft.", "success");
    },
  });
}

export function useBulkProductAction() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ ids, action, categoryId }: { ids: number[]; action: BulkProductAction; categoryId?: number }) =>
      adminProductsService.bulkAction(ids, action, categoryId),
    onSuccess: (affected) => {
      invalidate();
      toast(`${affected} product${affected === 1 ? "" : "s"} updated.`, "success");
    },
  });
}
