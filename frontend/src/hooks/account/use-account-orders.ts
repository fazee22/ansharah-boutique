"use client";

import { useQuery } from "@tanstack/react-query";
import { accountOrdersService } from "@/services/api/account/orders.service";

export const accountOrderKeys = {
  all: ["account", "orders"] as const,
  list: (page: number) => [...accountOrderKeys.all, "list", page] as const,
  detail: (id: number) => [...accountOrderKeys.all, "detail", id] as const,
};

export function useAccountOrders(page: number = 1) {
  return useQuery({
    queryKey: accountOrderKeys.list(page),
    queryFn: () => accountOrdersService.list(page),
    placeholderData: (previous) => previous,
  });
}

export function useAccountOrder(id: number | null) {
  return useQuery({
    queryKey: accountOrderKeys.detail(id ?? -1),
    queryFn: () => accountOrdersService.get(id as number),
    enabled: id !== null,
  });
}
