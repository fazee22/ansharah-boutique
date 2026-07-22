import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AdminProduct } from "@/types/admin/product";
import type { AdminOrder } from "@/types/admin/order";

export interface AdminDashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalCategories: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  lowStockProducts: AdminProduct[];
  bestSellingProducts: AdminProduct[];
  recentActivity: AdminProduct[];
  latestOrders: AdminOrder[];
}

export const adminDashboardService = {
  async get(): Promise<AdminDashboardData> {
    const { data } = await apiClient.get<ApiSuccessResponse<AdminDashboardData>>(API_ENDPOINTS.admin.dashboard);
    return data.data;
  },
};
