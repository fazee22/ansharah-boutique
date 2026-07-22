"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCustomersService } from "@/services/api/admin/customers.service";
import { toast } from "@/store/toast-store";
import type { AccountStatus, CustomerListFilters } from "@/types/admin/customer";

export const customerKeys = {
  all: ["admin", "customers"] as const,
  list: (filters: CustomerListFilters) => [...customerKeys.all, "list", filters] as const,
  detail: (id: number) => [...customerKeys.all, "detail", id] as const,
};

export function useCustomerList(filters: CustomerListFilters) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => adminCustomersService.list(filters),
    placeholderData: (previous) => previous,
  });
}

export function useCustomer(id: number | null) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? -1),
    queryFn: () => adminCustomersService.get(id as number),
    enabled: id !== null,
  });
}

export function useUpdateCustomerStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountStatus: AccountStatus) => adminCustomersService.updateStatus(id, accountStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast("Account status updated.", "success");
    },
  });
}

export function useAddCustomerNote(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => adminCustomersService.addNote(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      toast("Note added.", "success");
    },
  });
}
