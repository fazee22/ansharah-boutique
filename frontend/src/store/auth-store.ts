import { create } from "zustand";
import Cookies from "js-cookie";
import { env } from "@/config/env";
import type { User } from "@/types/user";

/** Matches `backend/config/jwt.php`'s `refresh_ttl` (14 days) — refreshing past this window is rejected server-side no matter how long the cookie itself survives. */
const REMEMBER_ME_DAYS = 14;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string, expiresAt: string, rememberMe?: boolean) => void;
  clearSession: () => void;
  setHydrated: () => void;
}

/**
 * Minimal, framework-agnostic auth state. The JWT itself lives in an
 * httpOnly-preferred cookie (`auth.service.ts` / `apiClient`
 * interceptor read it via `js-cookie` for the SPA-navigation case);
 * this store only tracks the *client-visible* session shape so UI can
 * react to login/logout without re-fetching `/auth/me` on every
 * render.
 *
 * "Remember Login": the access token itself is always short-lived
 * (`config/jwt.php`'s `ttl`, ~60 minutes) — what `rememberMe`
 * actually controls is the *cookie's* own browser-side lifetime.
 * With it checked, the cookie (and therefore the ability to silently
 * refresh — see `services/api/client.ts`'s 401 interceptor) survives
 * up to `REMEMBER_ME_DAYS`; without it, the cookie expires with the
 * token itself and the browser forgets the session as soon as the
 * access token would have expired anyway.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setSession: (user, accessToken, expiresAt, rememberMe = false) => {
    const cookieExpiry = rememberMe
      ? new Date(Date.now() + REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000)
      : new Date(expiresAt);

    Cookies.set(env.auth.cookieName, accessToken, {
      expires: cookieExpiry,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    set({ user, isAuthenticated: true });
  },

  clearSession: () => {
    Cookies.remove(env.auth.cookieName);
    set({ user: null, isAuthenticated: false });
  },

  setHydrated: () => set({ isHydrated: true }),
}));
