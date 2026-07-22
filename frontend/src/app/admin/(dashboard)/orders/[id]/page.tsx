"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Printer, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { OrderStatusChanger } from "@/components/admin/orders/order-status-changer";
import { OrderTimeline } from "@/components/admin/orders/order-timeline";
import { PrintInvoice } from "@/components/admin/orders/print-invoice";
import { NotesPanel } from "@/components/admin/shared/notes-panel";
import { useOrder, useAddOrderNote } from "@/hooks/admin/use-admin-orders";
import { formatCurrency, formatDate } from "@/lib/format";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const orderId = Number(id);
  const { data: order, isLoading, isError } = useOrder(Number.isFinite(orderId) ? orderId : null);
  const addNote = useAddOrderNote(orderId);

  if (!Number.isFinite(orderId)) notFound();

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
    <>
      <div className="flex flex-col gap-8 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-display-sm font-light text-foreground">{order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-body-sm text-muted-foreground">
              Placed {formatDate(order.createdAt, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Button variant="outline" size="md" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-hairline bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-heading-sm text-foreground">
                <Package className="h-4 w-4" aria-hidden="true" />
                Products Ordered
              </h2>
              <ul className="flex flex-col divide-y divide-hairline">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone/40">
                      {item.productImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-only order line-item preview
                        <img src={item.productImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-body-sm text-ink">{item.productName}</span>
                      <span className="font-mono text-caption text-muted-foreground">
                        {item.productSku} · Qty {item.quantity}
                      </span>
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
                {order.discount > 0 ? (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span className="font-mono">-{formatCurrency(order.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-medium text-ink">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-hairline bg-card p-6">
                <h2 className="mb-3 font-display text-heading-sm text-foreground">Customer</h2>
                <p className="text-body-sm text-ink">{order.customerName}</p>
                <p className="text-body-sm text-muted-foreground">{order.customerEmail}</p>
                <p className="text-body-sm text-muted-foreground">{order.customerPhone}</p>
                <p className="mt-2 text-caption text-muted-foreground">
                  Payment: {order.paymentMethod.replace("_", " ")} — {order.paymentStatus}
                </p>
              </div>

              <div className="rounded-lg border border-hairline bg-card p-6">
                <h2 className="mb-3 font-display text-heading-sm text-foreground">Shipping Address</h2>
                <p className="text-body-sm text-ink">{order.shippingAddress.fullName}</p>
                <p className="text-body-sm text-muted-foreground">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 ? (
                  <p className="text-body-sm text-muted-foreground">{order.shippingAddress.line2}</p>
                ) : null}
                <p className="text-body-sm text-muted-foreground">
                  {order.shippingAddress.city}
                  {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
                </p>
                <p className="text-body-sm text-muted-foreground">{order.shippingAddress.country}</p>
              </div>
            </div>

            <NotesPanel
              title="Order Notes"
              notes={order.notes}
              onAddNote={(body) => addNote.mutate(body)}
              isPending={addNote.isPending}
            />
          </div>

          <div className="flex flex-col gap-6">
            <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
            <div className="rounded-lg border border-hairline bg-card p-6">
              <h2 className="mb-4 font-display text-heading-sm text-foreground">Order Timeline</h2>
              <OrderTimeline history={order.statusHistory} />
            </div>
          </div>
        </div>
      </div>

      <PrintInvoice order={order} />
    </>
  );
}
