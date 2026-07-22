"use client";

import { Printer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintInvoice } from "./print-invoice";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AccountOrder } from "@/types/account/order";

export interface OrderSummaryCardProps {
  order: AccountOrder;
  showDownloadInvoice?: boolean;
}

/** Estimated delivery is derived, not stored — a simple +5 business-day-ish estimate from order date, consistent with the Shipping Policy page's stated 2–7 business day range. Becomes a real courier estimate once shipping integration exists. */
function estimatedDeliveryLabel(createdAt: string): string {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function OrderSummaryCard({ order, showDownloadInvoice = true }: OrderSummaryCardProps) {
  return (
    <>
      <div className="flex flex-col gap-6 print:hidden">
        <div className="rounded-lg border border-hairline bg-porcelain p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-heading-sm text-foreground">Order Summary</h2>
            {showDownloadInvoice ? (
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                Download Invoice
              </Button>
            ) : null}
          </div>

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-porcelain p-6">
            <h3 className="mb-3 font-display text-heading-sm text-foreground">Customer Information</h3>
            <p className="text-body-sm text-ink">{order.shippingAddress.fullName}</p>
            <p className="text-body-sm text-muted-foreground">{order.shippingAddress.phone}</p>
          </div>

          <div className="rounded-lg border border-hairline bg-porcelain p-6">
            <h3 className="mb-3 font-display text-heading-sm text-foreground">Shipping Address</h3>
            <p className="text-body-sm text-ink">{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 ? <p className="text-body-sm text-ink">{order.shippingAddress.line2}</p> : null}
            <p className="text-body-sm text-muted-foreground">
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-hairline bg-brass/5 p-5">
          <Truck className="h-5 w-5 shrink-0 text-brass-dark" aria-hidden="true" />
          <div>
            <p className="text-body-sm text-ink">Estimated Delivery</p>
            <p className="text-caption text-muted-foreground">
              Around {estimatedDeliveryLabel(order.createdAt)}, based on our standard{" "}
              {formatDate(order.createdAt, { month: "short", day: "numeric" })} dispatch window.
            </p>
          </div>
        </div>
      </div>

      {showDownloadInvoice ? <PrintInvoice order={order} /> : null}
    </>
  );
}

export { OrderSummaryCard };
