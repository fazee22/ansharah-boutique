import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { AccountOrder } from "@/types/account/order";

export const accountOrdersService = {
  async list(page: number = 1): Promise<PaginatedResult<AccountOrder>> {
    const { data } = await apiClient.get<ApiSuccessResponse<AccountOrder[]>>(API_ENDPOINTS.account.orders, {
      params: { page },
    });
    return { items: data.data, meta: data.meta! };
  },

  async get(id: number): Promise<AccountOrder> {
    const { data } = await apiClient.get<ApiSuccessResponse<AccountOrder>>(API_ENDPOINTS.account.order(id));
    return data.data;
  },
};
