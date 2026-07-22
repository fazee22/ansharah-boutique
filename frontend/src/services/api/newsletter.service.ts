import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";

/**
 * Public subscribe call — real as of Phase 7. Backs
 * `components/shared/newsletter-form.tsx`, used by both the footer
 * and the homepage newsletter section (Phase 2/3), which previously
 * only validated the email client-side and simulated success.
 */
export const newsletterService = {
  async subscribe(email: string, source?: string): Promise<void> {
    await apiClient.post<ApiSuccessResponse<{ email: string }>>(API_ENDPOINTS.newsletter.subscribe, {
      email,
      source,
    });
  },
};
