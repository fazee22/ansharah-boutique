import { formatCurrency, formatDate } from "@/lib/format";
import { siteConfig } from "@/config/site";
import type { AccountOrder } from "@/types/account/order";

export interface PrintInvoiceProps {
  order: AccountOrder;
}

/**
 * The storefront's "Download Invoice UI" — same `hidden print:block`
 * mechanism as the admin's `components/admin/orders/print-invoice.tsx`
 * (Phase 7): invisible on screen, the only thing visible once
 * `window.print()` runs. The (site) Header/Footer now carry
 * `print:hidden` (added this phase) so printing produces a clean
 * invoice with no site chrome — the browser's own "Save as PDF"
 * print destination is the "download" in "Download Invoice," with no
 * PDF-generation library needed on either end.
 */
function PrintInvoice({ order }: PrintInvoiceProps) {
  return (
    <div className="hidden print:block">
      <div className="flex items-start justify-between border-b border-ink pb-6">
        <div>
          <h1 className="font-display text-2xl">{siteConfig.name}</h1>
          <p className="text-sm text-gray-600">{siteConfig.tagline}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold">INVOICE</h2>
          <p className="font-mono text-sm">{order.orderNumber}</p>
          <p className="text-sm text-gray-600">
            {formatDate(order.createdAt, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ship To</h3>
        <p className="mt-1 text-sm">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.line1}</p>
        {order.shippingAddress.line2 ? <p className="text-sm text-gray-600">{order.shippingAddress.line2}</p> : null}
        <p className="text-sm text-gray-600">
          {order.shippingAddress.city}
          {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
        </p>
        <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
      </div>

      <table className="mt-8 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink text-left">
            <th className="py-2">Item</th>
            <th className="py-2 text-right">Unit Price</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-64 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Shipping</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-ink py-2 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-gray-500">Thank you for shopping with {siteConfig.name}.</p>
    </div>
  );
}

export { PrintInvoice };
