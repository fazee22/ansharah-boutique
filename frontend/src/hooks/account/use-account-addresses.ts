"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountAddressesService } from "@/services/api/account/addresses.service";
import { toast } from "@/store/toast-store";
import type { AddressFormValues } from "@/types/account/address";

const addressesKey = ["account", "addresses"] as const;

export function useAccountAddresses() {
  return useQuery({
    queryKey: addressesKey,
    queryFn: () => accountAddressesService.list(),
  });
}

function useInvalidateAddresses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: addressesKey });
}

export function useCreateAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: (values: AddressFormValues) => accountAddressesService.create(values),
    onSuccess: () => {
      invalidate();
      toast("Address added.", "success");
    },
  });
}

export function useUpdateAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<AddressFormValues> }) =>
      accountAddressesService.update(id, values),
    onSuccess: () => {
      invalidate();
      toast("Address updated.", "success");
    },
  });
}

export function useDeleteAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: (id: number) => accountAddressesService.remove(id),
    onSuccess: () => {
      invalidate();
      toast("Address removed.", "success");
    },
  });
}

export function useSetDefaultAddress() {
  const invalidate = useInvalidateAddresses();
  return useMutation({
    mutationFn: (id: number) => accountAddressesService.setDefault(id),
    onSuccess: invalidate,
  });
}
