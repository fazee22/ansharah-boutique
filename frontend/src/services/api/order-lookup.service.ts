import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AccountOrder } from "@/types/account/order";

export const orderLookupService = {
  async find(orderNumber: string, email: string): Promise<AccountOrder> {
    const { data } = await apiClient.post<ApiSuccessResponse<AccountOrder>>(API_ENDPOINTS.orderLookup, {
      order_number: orderNumber,
      email,
    });
    return data.data;
  },
};
