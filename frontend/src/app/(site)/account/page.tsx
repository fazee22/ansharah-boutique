"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { authService } from "@/services/api/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { useAccountOrders } from "@/hooks/account/use-account-orders";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatCurrency, formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

/**
 * Deliberately NOT wrapped in `CustomerGuard` — this is where the
 * header's Account icon points for every visitor, guest included, so
 * it shows an inline sign-in prompt rather than bouncing a guest
 * straight to `/login` before they've even seen what an account
 * offers. The deeper pages (Profile, Addresses, Order History,
 * Settings) do use the guard.
 */
export default function AccountOverviewPage() {
  const user = useAuthStore((state) => state.user);
  const [checked, setChecked] = useState(false);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const { data: orders } = useAccountOrders(1);

  useEffect(() => {
    authService
      .me()
      .then((freshUser) => useAuthStore.setState({ user: freshUser, isAuthenticated: true }))
      .catch(() => useAuthStore.setState({ user: null, isAuthenticated: false }))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return <div className="h-64" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-hairline bg-porcelain px-6 py-16 text-center">
        <h1 className="font-display text-heading-lg text-foreground">Your Account</h1>
        <p className="max-w-sm text-body-sm text-muted-foreground">
          Sign in to track orders, manage addresses, and pick up your wishlist wherever you left it.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="primary" size="md">
            <Link href={ROUTES.login}>Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href={ROUTES.register}>Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  const recentOrders = orders?.items.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-body-sm text-muted-foreground">Here&apos;s a quick look at your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard icon={Package} label="Orders" value={orders?.meta.total ?? 0} href={ROUTES.orders} />
        <SummaryCard icon={Heart} label="Wishlist" value={wishlistCount} href={ROUTES.wishlist} />
        <SummaryCard icon={MapPin} label="Saved Addresses" href={ROUTES.accountAddresses} />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-porcelain p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-heading-sm text-foreground">Recent Orders</h2>
          <Link href={ROUTES.orders} className="flex items-center gap-1 text-caption text-brass-dark hover:underline">
            View All <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={ROUTES.orderDetail(order.id)}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:opacity-80"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-body-sm text-ink">{order.orderNumber}</span>
                    <span className="text-caption text-muted-foreground">
                      {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                  <span className="font-mono text-body-sm text-ink">{formatCurrency(order.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Package;
  label: string;
  value?: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-hairline bg-porcelain p-5 transition-colors hover:border-brass"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-brass-dark">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        {value !== undefined ? <span className="font-display text-heading-sm text-foreground">{value}</span> : null}
        <span className="text-caption text-muted-foreground">{label}</span>
      </span>
    </Link>
  );
}
