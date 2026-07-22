"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminNewsletterService } from "@/services/api/admin/newsletter.service";
import { toast } from "@/store/toast-store";

export const newsletterKeys = {
  all: ["admin", "newsletter-subscribers"] as const,
  list: (params: { search?: string; page?: number }) => [...newsletterKeys.all, "list", params] as const,
};

export function useNewsletterSubscribers(params: { search?: string; page?: number }) {
  return useQuery({
    queryKey: newsletterKeys.list(params),
    queryFn: () => adminNewsletterService.list(params),
    placeholderData: (previous) => previous,
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminNewsletterService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
      toast("Subscriber removed.", "success");
    },
  });
}

export function useExportSubscribers() {
  return useMutation({
    mutationFn: () => adminNewsletterService.export(),
    onError: () => toast("Export failed — please try again.", "error"),
  });
}
