import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/** Backs the Contact page's form (Phase 8) — a real, persisted submission via `POST /api/v1/contact`. */
export const contactService = {
  async submit(payload: ContactFormPayload): Promise<void> {
    await apiClient.post<ApiSuccessResponse<null>>(API_ENDPOINTS.contact, payload);
  },
};
