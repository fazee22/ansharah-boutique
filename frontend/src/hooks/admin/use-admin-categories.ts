"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCategoriesService } from "@/services/api/admin/categories.service";
import { toast } from "@/store/toast-store";
import type { CategoryFormValues } from "@/types/admin/category";

/**
 * Centralized query keys — every hook below reads/invalidates through
 * these instead of ad hoc string arrays, so a mutation can never
 * accidentally miss invalidating a query another hook depends on.
 */
export const categoryKeys = {
  all: ["admin", "categories"] as const,
  list: (params: { search?: string; parentId?: number; page?: number }) =>
    [...categoryKeys.all, "list", params] as const,
  tree: () => [...categoryKeys.all, "tree"] as const,
};

export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => adminCategoriesService.tree(),
  });
}

export function useCategoryList(params: { search?: string; parentId?: number; page?: number } = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => adminCategoriesService.list(params),
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: categoryKeys.all });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (values: CategoryFormValues) => adminCategoriesService.create(values),
    onSuccess: () => {
      invalidate();
      toast("Category created.", "success");
    },
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<CategoryFormValues> }) =>
      adminCategoriesService.update(id, values),
    onSuccess: () => {
      invalidate();
      toast("Category updated.", "success");
    },
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (id: number) => adminCategoriesService.remove(id),
    onSuccess: () => {
      invalidate();
      toast("Category deleted.", "success");
    },
    onError: (error: { message?: string }) => {
      toast(error.message ?? "Couldn't delete this category.", "error");
    },
  });
}

export function useToggleCategoryVisibility() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (id: number) => adminCategoriesService.toggleVisibility(id),
    onSuccess: invalidate,
  });
}
export function useUploadCategoryImage() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => adminCategoriesService.uploadImage(id, file),
    onSuccess: () => {
      invalidate();
      toast("Image uploaded.", "success");
    },
    onError: (error: { message?: string }) => {
      toast(error.message ?? "Couldn't upload this image.", "error");
    },
  });
}

export function useReorderCategories() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (items: { id: number; position: number }[]) => adminCategoriesService.reorder(items),
    onSuccess: invalidate,
  });
}
