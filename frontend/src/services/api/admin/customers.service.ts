import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse, PaginatedResult } from "@/types/api";
import type { AccountStatus, AdminCustomer, CustomerListFilters, CustomerStats } from "@/types/admin/customer";

export const adminCustomersService = {
  async list(filters: CustomerListFilters = {}): Promise<PaginatedResult<AdminCustomer>> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminCustomer[]>>(API_ENDPOINTS.admin.customers, {
      params: {
        search: filters.search || undefined,
        account_status: filters.accountStatus,
        page: filters.page,
        per_page: filters.perPage,
      },
    });
    return { items: data.data, meta: data.meta! };
  },

  async get(id: number): Promise<{ customer: AdminCustomer; stats: CustomerStats }> {
    const { data } = await apiClient.get<ApiSuccessResponse<{ customer: AdminCustomer; stats: CustomerStats }>>(
      API_ENDPOINTS.admin.customer(id),
    );
    return data.data;
  },

  async updateStatus(id: number, accountStatus: AccountStatus): Promise<AdminCustomer> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminCustomer>>(API_ENDPOINTS.admin.customerStatus(id), {
      account_status: accountStatus,
    });
    return data.data;
  },

  async addNote(id: number, body: string): Promise<AdminCustomer> {
    const { data } = await apiClient.post<ApiSuccessResponse<AdminCustomer>>(API_ENDPOINTS.admin.customerNotes(id), {
      body,
    });
    return data.data;
  },
};
