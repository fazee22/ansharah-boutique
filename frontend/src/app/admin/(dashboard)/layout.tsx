import type { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/layout/admin-shell";

/**
 * Every route under `admin/(dashboard)` — dashboard home, products,
 * categories — renders through this layout. `admin/login` is a
 * sibling OUTSIDE this route group, so it never gets wrapped by
 * `AdminGuard` (which would otherwise redirect an unauthenticated
 * visitor straight back to the login page they're already on).
 */
export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
