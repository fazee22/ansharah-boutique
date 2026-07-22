"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/api/auth.service";
import { Spinner } from "@/components/shared/spinner";
import { ROUTES } from "@/constants/routes";

type GuardStatus = "checking" | "authorized" | "denied";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

/**
 * Wraps every route under `admin/` except `admin/login`. Client-side
 * role checks are advisory only — the real enforcement is the
 * backend's `role:admin,super_admin` middleware on every `/api/v1/admin/*`
 * route (see `backend/routes/api.php`); this guard exists so an
 * unauthorized visitor sees a redirect instead of a flash of admin UI
 * followed by every data request failing with 403.
 *
 * Always re-validates against `GET /auth/me` on mount rather than
 * trusting the client-side auth store alone — a token can be expired,
 * revoked, or (via the silent-refresh interceptor in
 * `services/api/client.ts`) transparently renewed, and `/auth/me` is
 * the one call that reflects the server's actual current view of the
 * session.
 */
function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<GuardStatus>("checking");
  const setSessionUser = useAuthStore((state) => state.setHydrated);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let cancelled = false;

    authService
      .me()
      .then((user) => {
        if (cancelled) return;
        if (!ADMIN_ROLES.has(user.role)) {
          setStatus("denied");
          router.replace(ROUTES.admin.login);
          return;
        }
        useAuthStore.setState({ user, isAuthenticated: true });
        setStatus("authorized");
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        setStatus("denied");
        router.replace(ROUTES.admin.login);
      })
      .finally(() => {
        if (!cancelled) setSessionUser();
      });

    return () => {
      cancelled = true;
    };
    // Deliberately runs once per mount only — a route change within
    // the already-authorized admin shell shouldn't re-trigger a full
    // re-validation round trip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status !== "authorized") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export { AdminGuard };
