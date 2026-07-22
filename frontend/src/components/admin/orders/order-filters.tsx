"use client";

import { Search } from "lucide-react";
import type { OrderListFilters, OrderStatus, PaymentStatus } from "@/types/admin/order";

export interface OrderFiltersBarProps {
  filters: OrderListFilters;
  onChange: (patch: Partial<OrderListFilters>) => void;
}

const STATUS_OPTIONS: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const PAYMENT_OPTIONS: { value: PaymentStatus | ""; label: string }[] = [
  { value: "", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "refunded", label: "Refunded" },
];

function OrderFiltersBar({ filters, onChange }: OrderFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[240px] sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={filters.search ?? ""}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by order #, name, or email…"
          className="h-11 w-full rounded-md border border-hairline bg-canvas py-2 pl-10 pr-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        />
      </div>

      <select
        value={filters.status ?? ""}
        onChange={(event) => onChange({ status: (event.target.value || undefined) as OrderStatus | undefined })}
        className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.paymentStatus ?? ""}
        onChange={(event) =>
          onChange({ paymentStatus: (event.target.value || undefined) as PaymentStatus | undefined })
        }
        className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        {PAYMENT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort ?? "newest"}
        onChange={(event) => onChange({ sort: event.target.value as OrderListFilters["sort"] })}
        className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="total_desc">Total: High to Low</option>
        <option value="total_asc">Total: Low to High</option>
      </select>
    </div>
  );
}

export { OrderFiltersBar };
