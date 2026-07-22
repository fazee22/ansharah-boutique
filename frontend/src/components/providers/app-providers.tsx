"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";

/**
 * Single composition root for client-side providers. `app/layout.tsx`
 * (a Server Component) renders this once so that adding a new
 * provider later never requires touching the root layout again.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
