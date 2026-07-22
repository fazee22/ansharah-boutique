"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductImagesService } from "@/services/api/admin/product-images.service";
import { productKeys } from "./use-admin-products";
import { toast } from "@/store/toast-store";

function useInvalidateProduct(productId: number) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
}

export function useUploadProductImage(productId: number) {
  const invalidate = useInvalidateProduct(productId);
  return useMutation({
    mutationFn: ({ file, isFeatured, onProgress }: { file: File; isFeatured?: boolean; onProgress?: (percent: number) => void }) =>
      adminProductImagesService.upload(productId, file, Boolean(isFeatured), onProgress),
    onSuccess: invalidate,
    onError: (error: { message?: string }) => {
      toast(error.message ?? "That image couldn't be uploaded.", "error");
    },
  });
}

export function useDeleteProductImage(productId: number) {
  const invalidate = useInvalidateProduct(productId);
  return useMutation({
    mutationFn: (imageId: number) => adminProductImagesService.remove(productId, imageId),
    onSuccess: invalidate,
    onError: (error: { message?: string }) => {
      toast(error.message ?? "Couldn't delete this image.", "error");
    },
  });
}

export function useSetFeaturedImage(productId: number) {
  const invalidate = useInvalidateProduct(productId);
  return useMutation({
    mutationFn: (imageId: number) => adminProductImagesService.setFeatured(productId, imageId),
    onSuccess: invalidate,
  });
}

export function useReorderProductImages(productId: number) {
  const invalidate = useInvalidateProduct(productId);
  return useMutation({
    mutationFn: (items: { id: number; position: number }[]) => adminProductImagesService.reorder(productId, items),
    onSuccess: invalidate,
  });
}
