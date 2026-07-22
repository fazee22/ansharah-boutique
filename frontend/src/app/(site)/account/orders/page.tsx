"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { CustomerGuard } from "@/components/account/customer-guard";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { Pagination } from "@/components/collections/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountOrders } from "@/hooks/account/use-account-orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

function OrderHistoryContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAccountOrders(page);
  const orders = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Order History</h1>
        <p className="text-body-sm text-muted-foreground">
          {data?.meta.total ?? "…"} order{data?.meta.total === 1 ? "" : "s"} placed.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will show up here."
          action={{ label: "Start Shopping", href: ROUTES.collections }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={ROUTES.orderDetail(order.id)}
                className="flex flex-col gap-3 rounded-lg border border-hairline bg-porcelain p-5 transition-colors hover:border-brass sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-body-sm text-ink">{order.orderNumber}</span>
                  <span className="text-caption text-muted-foreground">
                    Placed {formatDate(order.createdAt, { month: "long", day: "numeric", year: "numeric" })} ·{" "}
                    {order.itemCount ?? 0} item{order.itemCount === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-mono text-body-md text-ink">{formatCurrency(order.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && data.meta.lastPage > 1 ? (
        <Pagination currentPage={data.meta.currentPage} totalPages={data.meta.lastPage} onPageChange={setPage} />
      ) : null}
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <CustomerGuard>
      <OrderHistoryContent />
    </CustomerGuard>
  );
}
