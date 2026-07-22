import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AllSettings, SettingsGroup } from "@/types/admin/settings";

export const adminSettingsService = {
  async getAll(): Promise<AllSettings> {
    const { data } = await apiClient.get<ApiSuccessResponse<AllSettings>>(API_ENDPOINTS.admin.settings);
    return data.data;
  },

  async updateGroup<G extends SettingsGroup>(group: G, values: AllSettings[G]): Promise<AllSettings[G]> {
    const { data } = await apiClient.put<ApiSuccessResponse<AllSettings[G]>>(API_ENDPOINTS.admin.settings, {
      group,
      values,
    });
    return data.data;
  },
};
