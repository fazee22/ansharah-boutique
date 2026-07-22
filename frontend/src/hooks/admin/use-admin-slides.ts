"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminSlidesService } from "@/services/api/admin/slides.service";
import { toast } from "@/store/toast-store";
import type { SlideFormFields, SlideType } from "@/types/admin/slide";

export const slideKeys = {
  all: ["admin", "slides"] as const,
  list: (type: SlideType) => [...slideKeys.all, type] as const,
};

export function useSlideList(type: SlideType) {
  return useQuery({
    queryKey: slideKeys.list(type),
    queryFn: () => adminSlidesService.list(type),
  });
}

function useInvalidateSlides(type: SlideType) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: slideKeys.list(type) });
}

export function useUploadSlide(type: SlideType) {
  const invalidate = useInvalidateSlides(type);
  return useMutation({
    mutationFn: ({ file, fields }: { file: File; fields?: SlideFormFields }) =>
      adminSlidesService.upload(type, file, fields),
    onSuccess: invalidate,
    onError: (error: { message?: string }) => toast(error.message ?? "Upload failed.", "error"),
  });
}

export function useUpdateSlide(type: SlideType) {
  const invalidate = useInvalidateSlides(type);
  return useMutation({
    mutationFn: ({ id, fields }: { id: number; fields: SlideFormFields }) => adminSlidesService.update(id, fields),
    onSuccess: invalidate,
  });
}

export function useDeleteSlide(type: SlideType) {
  const invalidate = useInvalidateSlides(type);
  return useMutation({
    mutationFn: (id: number) => adminSlidesService.remove(id),
    onSuccess: () => {
      invalidate();
      toast("Slide deleted.", "success");
    },
  });
}

export function useToggleSlideActive(type: SlideType) {
  const invalidate = useInvalidateSlides(type);
  return useMutation({
    mutationFn: (id: number) => adminSlidesService.toggleActive(id),
    onSuccess: invalidate,
  });
}

export function useReorderSlides(type: SlideType) {
  const invalidate = useInvalidateSlides(type);
  return useMutation({
    mutationFn: (items: { id: number; position: number }[]) => adminSlidesService.reorder(type, items),
    onSuccess: invalidate,
  });
}
