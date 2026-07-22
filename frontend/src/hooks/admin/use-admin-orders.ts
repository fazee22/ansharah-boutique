"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminOrdersService } from "@/services/api/admin/orders.service";
import { toast } from "@/store/toast-store";
import type { OrderListFilters, OrderStatus } from "@/types/admin/order";

export const orderKeys = {
  all: ["admin", "orders"] as const,
  list: (filters: OrderListFilters) => [...orderKeys.all, "list", filters] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};

export function useOrderList(filters: OrderListFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => adminOrdersService.list(filters),
    placeholderData: (previous) => previous,
  });
}

export function useOrder(id: number | null) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? -1),
    queryFn: () => adminOrdersService.get(id as number),
    enabled: id !== null,
  });
}

export function useUpdateOrderStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, note }: { status: OrderStatus; note?: string }) =>
      adminOrdersService.updateStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast("Order status updated.", "success");
    },
  });
}

export function useAddOrderNote(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => adminOrdersService.addNote(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      toast("Note added.", "success");
    },
  });
}
