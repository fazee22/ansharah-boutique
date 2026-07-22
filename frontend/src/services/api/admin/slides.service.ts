import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AdminSlide, SlideFormFields, SlideType } from "@/types/admin/slide";

export const adminSlidesService = {
  async list(type: SlideType): Promise<AdminSlide[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminSlide[]>>(API_ENDPOINTS.admin.slides, {
      params: { type },
    });
    return data.data;
  },

  async upload(type: SlideType, file: File, fields: SlideFormFields = {}): Promise<AdminSlide> {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("image", file);
    if (fields.title) formData.append("title", fields.title);
    if (fields.subtitle) formData.append("subtitle", fields.subtitle);
    if (fields.linkUrl) formData.append("link_url", fields.linkUrl);
    if (fields.ctaLabel) formData.append("cta_label", fields.ctaLabel);

    const { data } = await apiClient.post<ApiSuccessResponse<AdminSlide>>(API_ENDPOINTS.admin.slides, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async update(id: number, fields: SlideFormFields): Promise<AdminSlide> {
    const { data } = await apiClient.put<ApiSuccessResponse<AdminSlide>>(API_ENDPOINTS.admin.slide(id), {
      title: fields.title,
      subtitle: fields.subtitle,
      link_url: fields.linkUrl,
      cta_label: fields.ctaLabel,
      is_active: fields.isActive,
    });
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.admin.slide(id));
  },

  async toggleActive(id: number): Promise<AdminSlide> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminSlide>>(API_ENDPOINTS.admin.slideToggleActive(id));
    return data.data;
  },

  async reorder(type: SlideType, items: { id: number; position: number }[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.admin.slidesReorder, { type, items });
  },
};
