import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { AdminOrder, OrderListFilters, OrderStatus } from "@/types/admin/order";

export const adminOrdersService = {
  async list(filters: OrderListFilters = {}): Promise<PaginatedResult<AdminOrder>> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminOrder[]>>(API_ENDPOINTS.admin.orders, {
      params: {
        search: filters.search || undefined,
        status: filters.status,
        payment_status: filters.paymentStatus,
        sort: filters.sort,
        page: filters.page,
        per_page: filters.perPage,
      },
    });
    return { items: data.data, meta: data.meta! };
  },

  async get(id: number): Promise<AdminOrder> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminOrder>>(API_ENDPOINTS.admin.order(id));
    return data.data;
  },

  async updateStatus(id: number, status: OrderStatus, note?: string): Promise<AdminOrder> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminOrder>>(API_ENDPOINTS.admin.orderStatus(id), {
      status,
      note,
    });
    return data.data;
  },

  async addNote(id: number, body: string): Promise<AdminOrder> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminOrder>>(API_ENDPOINTS.admin.orderNotes(id), { body });
    return data.data;
  },
};
