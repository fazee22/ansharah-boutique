import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { NewsletterSubscriber } from "@/types/admin/newsletter";

export const adminNewsletterService = {
  async list(params: { search?: string; page?: number } = {}): Promise<PaginatedResult<NewsletterSubscriber>> {
    const { data } = await apiClient.get<ApiSuccessResponse<NewsletterSubscriber[]>>(
      API_ENDPOINTS.admin.newsletterSubscribers,
      { params: { search: params.search || undefined, page: params.page } },
    );
    return { items: data.data, meta: data.meta! };
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.newsletterSubscriber(id));
  },

  /**
   * The export endpoint requires the same JWT bearer auth as every
   * other admin request, so a plain `<a href>` won't work — the
   * browser's normal navigation never attaches the Authorization
   * header. Fetching as a blob through `apiClient` (which does attach
   * it) and triggering a synthetic download link is the standard
   * workaround for authenticated file downloads.
   */
  async export(): Promise<void> {
    const response = await apiClient.get(API_ENDPOINTS.admin.newsletterExport, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
