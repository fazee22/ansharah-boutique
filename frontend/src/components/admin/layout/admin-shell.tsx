"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { useAdminThemeStore } from "@/store/admin-theme-store";
import { cn } from "@/lib/utils";

/**
 * Applies the admin theme's `.dark` class to its own wrapper (not
 * `<html>`), so dark mode is scoped entirely to the admin dashboard
 * subtree and can never leak into the storefront, which shares the
 * same root layout / html element but never enters dark mode.
 */
function AdminShell({ children }: { children: ReactNode }) {
  const theme = useAdminThemeStore((state) => state.theme);

  return (
    <div className={cn(theme === "dark" && "dark", "min-h-screen bg-canvas text-foreground")}>
      <div className="flex min-h-screen">
        <AdminSidebar className="hidden w-64 shrink-0 lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export { AdminShell };
