"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/api/auth.service";
import type { AuthCredentials, RegisterPayload } from "@/types/user";
import { ROUTES } from "@/constants/routes";

/**
 * Foundation auth hook, shared by whatever storefront login/register
 * pages get built and (as of Phase 6) the admin login page — one
 * `login`/`logout` implementation, not two copies that could drift.
 */
export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setSession, clearSession } = useAuthStore();

  const login = useCallback(
    async (credentials: AuthCredentials, rememberMe: boolean = false) => {
      const session = await authService.login(credentials);
      setSession(session.user, session.accessToken, session.expiresAt, rememberMe);
      return session;
    },
    [setSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const session = await authService.register(payload);
      setSession(session.user, session.accessToken, session.expiresAt);
      return session;
    },
    [setSession],
  );

  /** Clears the session and, unless `redirectTo` is explicitly `null`, navigates there (defaults to the storefront login — the admin topbar passes `ROUTES.admin.login` instead). */
  const logout = useCallback(
    async (redirectTo: string | null = ROUTES.login) => {
      await authService.logout().finally(() => {
        clearSession();
        if (redirectTo) router.push(redirectTo);
      });
    },
    [clearSession, router],
  );

  return { user, isAuthenticated, login, register, logout };
}
