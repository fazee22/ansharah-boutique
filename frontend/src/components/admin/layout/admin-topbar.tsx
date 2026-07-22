"use client";

import { useState } from "react";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { AdminSidebar } from "./admin-sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

function AdminTopbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-hairline bg-porcelain px-4 print:hidden sm:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open admin menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-ink/5 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" title="Admin navigation" className="w-72 p-0">
            <AdminSidebar className="w-full" onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">
          Admin Dashboard
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <div className="mx-1 hidden h-6 w-px bg-hairline sm:block" />

        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-muted-foreground">
            <UserIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-body-sm text-ink">{user?.name ?? "Admin"}</span>
        </div>

        <button
          type="button"
          onClick={() => logout(ROUTES.admin.login)}
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export { AdminTopbar };
