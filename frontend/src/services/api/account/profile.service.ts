import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { User } from "@/types/user";

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export const accountProfileService = {
  async get(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccessResponse<User>>(API_ENDPOINTS.account.profile);
    return data.data;
  },

  async update(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.put<ApiSuccessResponse<User>>(API_ENDPOINTS.account.profile, payload);
    return data.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.put(API_ENDPOINTS.account.password, {
      current_password: payload.currentPassword,
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
    });
  },
};
