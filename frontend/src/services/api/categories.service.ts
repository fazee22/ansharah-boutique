import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AdminCategory } from "@/types/admin/category";

export const categoriesService = {
  async list(): Promise<AdminCategory[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminCategory[]>>(API_ENDPOINTS.categories);
    return data.data;
  },

  async tree(): Promise<AdminCategory[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminCategory[]>>(API_ENDPOINTS.categories, {
      params: { tree: 1 },
    });
    return data.data;
  },
};