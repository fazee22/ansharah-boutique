import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AdminSlide, SlideType } from "@/types/admin/slide";

export const slidesService = {
  async list(type: SlideType): Promise<AdminSlide[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminSlide[]>>(API_ENDPOINTS.slides, {
      params: { type },
    });
    return data.data;
  },
};