"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderLookupService } from "@/services/api/order-lookup.service";
import { recallOrderLookupEmail, rememberOrderLookupEmail } from "@/lib/order-lookup-memory";

/**
 * Shared by the Order Confirmation and all three Payment
 * (Success/Failed/Pending) pages — given an order number from the
 * URL, resolves the matching order using a remembered email from
 * this session if available, otherwise exposes `needsEmail` so the
 * page can render `OrderLookupGate` and call `submitEmail()` once the
 * visitor provides one.
 */
export function useOrderLookup(orderNumber: string | null) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(recallOrderLookupEmail());
  }, []);

  const query = useQuery({
    queryKey: ["order-lookup", orderNumber, email],
    queryFn: () => orderLookupService.find(orderNumber as string, email as string),
    enabled: Boolean(orderNumber && email),
    retry: false,
  });

  function submitEmail(submittedEmail: string) {
    rememberOrderLookupEmail(submittedEmail);
    setEmail(submittedEmail);
  }

  return {
    order: query.data,
    isLoading: Boolean(email) && query.isLoading,
    isError: query.isError,
    needsEmail: !email || query.isError,
    submitEmail,
  };
}
