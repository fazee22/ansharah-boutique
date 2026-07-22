import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AllSettings } from "@/types/admin/settings";

/**
 * Public, read-only counterpart to `services/api/admin/settings.service.ts`
 * — same shape, no auth. This is what finally lets the storefront
 * read the admin's real Website/WhatsApp/SEO/Homepage/Marquee/Sale
 * settings instead of the static `config/site.ts` values (Phase 10;
 * see PROJECT_MEMORY.md for the Phases 6–9 history of this gap).
 */
export const publicSettingsService = {
  async getAll(): Promise<AllSettings> {
    const { data } = await apiClient.get<ApiSuccessResponse<AllSettings>>(API_ENDPOINTS.settings);
    return data.data;
  },
};
