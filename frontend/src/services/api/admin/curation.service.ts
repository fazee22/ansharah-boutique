import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AdminProduct } from "@/types/admin/product";

export type CurationType = "new_arrivals" | "sale";

export const adminCurationService = {
  async list(type: CurationType): Promise<AdminProduct[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminProduct[]>>(API_ENDPOINTS.admin.curation, {
      params: { type },
    });
    return data.data;
  },

  async add(type: CurationType, productId: number): Promise<AdminProduct> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminProduct>>(API_ENDPOINTS.admin.curationAdd(productId), {
      type,
    });
    return data.data;
  },

  async remove(type: CurationType, productId: number): Promise<AdminProduct> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminProduct>>(
      API_ENDPOINTS.admin.curationRemove(productId),
      { type },
    );
    return data.data;
  },

  async reorder(type: CurationType, items: { id: number; position: number }[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.admin.curationReorder, { type, items });
  },
};
