import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { env } from "@/config/env";

/**
 * Single Axios instance for all API calls. Feature services
 * (`auth.service.ts`, and future `product.service.ts`, etc.) import
 * this client instead of calling `axios` directly, so auth headers,
 * timeouts, and error normalization stay consistent app-wide.
 */
export const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  timeout: env.api.timeoutMs,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get(env.auth.cookieName);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface NormalizedApiError {
  status: number | null;
  message: string;
  errors?: Record<string, string[]>;
}

interface RetriableRequestConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

/**
 * Deduplicates concurrent refresh attempts — if five requests 401 at
 * once (e.g. a dashboard page firing several queries in parallel),
 * they all await the SAME in-flight refresh call instead of each
 * independently hitting `/auth/refresh`.
 */
let refreshPromise: Promise<string> | null = null;

/**
 * Calls `/auth/refresh` directly via a bare `axios` request (NOT
 * `apiClient`) — routing it through `apiClient` would re-enter this
 * same response interceptor on any failure, risking infinite
 * recursion. The refresh endpoint itself still needs the *current*
 * (possibly just-expired) token as a Bearer header, since
 * `jwt.auth`'s grace/blacklist window is what makes a refresh valid
 * at all (see `backend/config/jwt.php`'s `refresh_ttl`).
 */
function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const currentToken = Cookies.get(env.auth.cookieName);
    refreshPromise = axios
      .post(
        `${env.api.baseUrl}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${currentToken}`, Accept: "application/json" } },
      )
      .then((response) => {
        const session = response.data?.data;
        Cookies.set(env.auth.cookieName, session.accessToken, {
          expires: new Date(session.expiresAt),
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        return session.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const config = error.config as RetriableRequestConfig | undefined;
    const isAuthEndpoint = config?.url?.includes("/auth/login") || config?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true;
      try {
        const newToken = await refreshAccessToken();
        config.headers = { ...config.headers, Authorization: `Bearer ${newToken}` };
        return apiClient.request(config);
      } catch {
        Cookies.remove(env.auth.cookieName);
        // Falls through to the normalized rejection below — the caller
        // (e.g. AdminGuard) is responsible for redirecting to login;
        // this interceptor's job is only the silent-refresh attempt.
      }
    }

    const normalized: NormalizedApiError = {
      status: error.response?.status ?? null,
      message:
        error.response?.data?.message ??
        error.message ??
        "Something went wrong. Please try again.",
      errors: error.response?.data?.errors,
    };
    return Promise.reject(normalized);
  },
);
