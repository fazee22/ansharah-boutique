"use client";

import { useQuery } from "@tanstack/react-query";
import { publicSettingsService } from "@/services/api/settings.service";

/**
 * Powers every storefront consumer of admin-managed settings (Phase
 * 10): the WhatsApp floating/order buttons, homepage section
 * visibility, footer contact details. A 5-minute `staleTime` is
 * intentional — these change rarely, and re-fetching on every
 * navigation would be wasted work for data an admin edits maybe a few
 * times a year. Callers must handle `data` being `undefined` (loading,
 * or the request failed) by falling back to `config/site.ts`'s static
 * values — the storefront should never visibly break just because
 * this endpoint is briefly unreachable.
 */
export function useSiteSettings() {
  return useQuery({
    queryKey: ["public-settings"],
    queryFn: () => publicSettingsService.getAll(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
