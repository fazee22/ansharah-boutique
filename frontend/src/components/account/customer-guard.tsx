"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/api/auth.service";
import { Spinner } from "@/components/shared/spinner";
import { ROUTES } from "@/constants/routes";

type GuardStatus = "checking" | "authorized" | "denied";

/**
 * Wraps the account pages that genuinely require a signed-in customer
 * (Profile, Addresses, Order History, Settings) — NOT the Wishlist
 * page, which works for guests too (see `store/wishlist-store.ts`'s
 * Phase 8 decision) and is deliberately left outside this guard.
 * Redirects to `/login?returnTo=<current path>` so a successful
 * login lands the visitor back where they were headed, rather than a
 * generic account home.
 */
function CustomerGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<GuardStatus>("checking");
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let cancelled = false;

    authService
      .me()
      .then((user) => {
        if (cancelled) return;
        useAuthStore.setState({ user, isAuthenticated: true });
        setStatus("authorized");
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        setStatus("denied");
        router.replace(`${ROUTES.login}?returnTo=${encodeURIComponent(pathname)}`);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status !== "authorized") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export { CustomerGuard };
