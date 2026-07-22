"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CustomerGuard } from "@/components/account/customer-guard";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { OrderTrackingTimeline } from "@/components/account/order-tracking-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountOrder } from "@/hooks/account/use-account-orders";
import { formatCurrency, formatDate } from "@/lib/format";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

function OrderDetailContent({ orderId }: { orderId: number }) {
  const { data: order, isLoading, isError } = useAccountOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64 rounded" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-display-sm font-light text-foreground">{order.orderNumber}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-body-sm text-muted-foreground">
          Placed {formatDate(order.createdAt, { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="rounded-lg border border-hairline bg-porcelain p-6">
        <h2 className="mb-6 font-display text-heading-sm text-foreground">Order Status</h2>
        <OrderTrackingTimeline status={order.status} />
      </div>

      <div className="rounded-lg border border-hairline bg-porcelain p-6">
        <h2 className="mb-4 font-display text-heading-sm text-foreground">Items</h2>
        <ul className="flex flex-col divide-y divide-hairline">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone/40">
                {item.productImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- order line-item snapshot image
                  <img src={item.productImageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-body-sm text-ink">{item.productName}</span>
                <span className="font-mono text-caption text-muted-foreground">Qty {item.quantity}</span>
              </div>
              <span className="font-mono text-body-sm text-ink">{formatCurrency(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-1 border-t border-hairline pt-4 text-body-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="font-mono">{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between font-medium text-ink">
            <span>Total</span>
            <span className="font-mono">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-hairline bg-porcelain p-6">
        <h2 className="mb-3 font-display text-heading-sm text-foreground">Shipping Address</h2>
        <p className="text-body-sm text-ink">{order.shippingAddress.fullName}</p>
        <p className="text-body-sm text-muted-foreground">{order.shippingAddress.line1}</p>
        {order.shippingAddress.line2 ? <p className="text-body-sm text-muted-foreground">{order.shippingAddress.line2}</p> : null}
        <p className="text-body-sm text-muted-foreground">
          {order.shippingAddress.city}
          {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
        </p>
        <p className="text-body-sm text-muted-foreground">{order.shippingAddress.country}</p>
      </div>
    </div>
  );
}

export default function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const orderId = Number(id);

  if (!Number.isFinite(orderId)) notFound();

  return (
    <CustomerGuard>
      <OrderDetailContent orderId={orderId} />
    </CustomerGuard>
  );
}
