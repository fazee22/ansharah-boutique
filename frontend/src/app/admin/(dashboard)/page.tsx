"use client";

import Link from "next/link";
import { Package, FileEdit, FolderTree, AlertTriangle, XCircle, DollarSign, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { ChartPlaceholder } from "@/components/admin/dashboard/chart-placeholder";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { AdminProductMiniList } from "@/components/admin/dashboard/admin-product-mini-list";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAdminDashboard } from "@/hooks/admin/use-admin-dashboard";
import { formatCurrency, formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  const { stats, lowStockProducts, bestSellingProducts, recentActivity, latestOrders } = data;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Dashboard</h1>
        <p className="text-body-sm text-muted-foreground">An overview of the store, updated live.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts} icon={Package} />
        <StatCard label="Published" value={stats.publishedProducts} icon={FileEdit} />
        <StatCard label="Total Categories" value={stats.totalCategories} icon={FolderTree} />
        <StatCard label="Low Stock" value={stats.lowStockCount} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of Stock" value={stats.outOfStockCount} icon={XCircle} tone="danger" />
        <StatCard label="Revenue (Paid)" value={formatCurrency(stats.revenue)} icon={DollarSign} />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartPlaceholder />
        </div>
        <QuickActions />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-heading-sm text-foreground">Latest Orders</h3>
          <Link href={ROUTES.admin.orders} className="text-caption text-brass-dark hover:underline">
            View All
          </Link>
        </div>
        {latestOrders.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {latestOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={ROUTES.admin.orderDetail(order.id)}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-ink/[0.02]"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-body-sm text-ink">{order.orderNumber}</span>
                    <span className="text-caption text-muted-foreground">{order.customerName}</span>
                  </div>
                  <span className="hidden font-mono text-caption text-muted-foreground sm:inline">
                    {formatDate(order.createdAt, { month: "short", day: "numeric" })}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="font-mono text-body-sm text-ink">{formatCurrency(order.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AdminProductMiniList
          title="Low Stock"
          products={lowStockProducts}
          emptyMessage="Nothing is running low right now."
          renderTrailing={(product) => (
            <Badge variant="destructive" className="shrink-0">
              {product.stockQuantity} left
            </Badge>
          )}
        />
        <AdminProductMiniList
          title="Best Selling"
          products={bestSellingProducts}
          emptyMessage="No sales data yet — this fills in as orders come through."
        />
        <AdminProductMiniList
          title="Recent Activity"
          products={recentActivity}
          emptyMessage="No recent product changes."
        />
      </div>
    </div>
  );
}
