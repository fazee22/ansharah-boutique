"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, MapPin, Package, Heart, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: ROUTES.account, icon: LayoutDashboard, exact: true },
  { label: "Profile", href: ROUTES.accountProfile, icon: User },
  { label: "Addresses", href: ROUTES.accountAddresses, icon: MapPin },
  { label: "Order History", href: ROUTES.orders, icon: Package },
  { label: "Wishlist", href: ROUTES.wishlist, icon: Heart },
  { label: "Account Settings", href: ROUTES.accountSettings, icon: Settings },
];

/** Shared navigation for every `/account/*` page — visible to guests too (the Wishlist link works without login), individual pages decide whether they require `CustomerGuard`. */
function AccountNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col gap-1 lg:w-56 lg:shrink-0" aria-label="Account">
      {user ? (
        <div className="mb-2 flex flex-col gap-0.5 border-b border-hairline pb-4">
          <span className="text-body-sm text-ink">{user.name}</span>
          <span className="text-caption text-muted-foreground">{user.email}</span>
        </div>
      ) : null}

      <div className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2.5 text-body-sm transition-colors",
                isActive ? "bg-ink text-porcelain" : "text-muted-foreground hover:bg-porcelain hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}

        {user ? (
          <button
            type="button"
            onClick={() => logout(ROUTES.home)}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2.5 text-left text-body-sm text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign Out
          </button>
        ) : null}
      </div>
    </nav>
  );
}

export { AccountNav };
