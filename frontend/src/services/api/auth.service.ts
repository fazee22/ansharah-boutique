import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthCredentials, AuthSession, RegisterPayload, User } from "@/types/user";

/**
 * Thin, typed wrappers around the auth REST endpoints. Components and
 * hooks call these functions rather than touching `apiClient`
 * directly, keeping the HTTP contract in one place.
 */
export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthSession>>(
      API_ENDPOINTS.auth.login,
      credentials,
    );
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthSession>>(
      API_ENDPOINTS.auth.register,
      payload,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.logout);
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccessResponse<User>>(
      API_ENDPOINTS.auth.me,
    );
    return data.data;
  },
};
