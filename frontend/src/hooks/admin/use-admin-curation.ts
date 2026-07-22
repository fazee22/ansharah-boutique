"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCurationService, type CurationType } from "@/services/api/admin/curation.service";
import { toast } from "@/store/toast-store";

export const curationKeys = {
  all: ["admin", "curation"] as const,
  list: (type: CurationType) => [...curationKeys.all, type] as const,
};

export function useCurationList(type: CurationType) {
  return useQuery({
    queryKey: curationKeys.list(type),
    queryFn: () => adminCurationService.list(type),
  });
}

function useInvalidateCuration(type: CurationType) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: curationKeys.list(type) });
}

export function useAddToCuration(type: CurationType) {
  const invalidate = useInvalidateCuration(type);
  return useMutation({
    mutationFn: (productId: number) => adminCurationService.add(type, productId),
    onSuccess: () => {
      invalidate();
      toast("Added.", "success");
    },
  });
}

export function useRemoveFromCuration(type: CurationType) {
  const invalidate = useInvalidateCuration(type);
  return useMutation({
    mutationFn: (productId: number) => adminCurationService.remove(type, productId),
    onSuccess: () => {
      invalidate();
      toast("Removed.", "success");
    },
  });
}

export function useReorderCuration(type: CurationType) {
  const invalidate = useInvalidateCuration(type);
  return useMutation({
    mutationFn: (items: { id: number; position: number }[]) => adminCurationService.reorder(type, items),
    onSuccess: invalidate,
  });
}
