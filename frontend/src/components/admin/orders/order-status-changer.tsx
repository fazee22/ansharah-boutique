"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/admin/use-admin-orders";
import type { OrderStatus } from "@/types/admin/order";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export interface OrderStatusChangerProps {
  orderId: number;
  currentStatus: OrderStatus;
}

function OrderStatusChanger({ orderId, currentStatus }: OrderStatusChangerProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
  const updateStatus = useUpdateOrderStatus(orderId);

  const isDirty = status !== currentStatus;

  function handleSave() {
    updateStatus.mutate(
      { status, note: note.trim() || undefined },
      { onSuccess: () => setNote("") },
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-hairline bg-card p-6">
      <h2 className="font-display text-heading-sm text-foreground">Order Status</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-status" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
          Status
        </label>
        <select
          id="order-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus)}
          className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isDirty ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status-note" className="font-mono text-caption uppercase tracking-wide text-muted-foreground">
            Note (optional)
          </label>
          <input
            id="status-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Dispatched via TCS, tracking #123"
            className="h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          />
        </div>
      ) : null}

      <Button
        variant="primary"
        size="md"
        disabled={!isDirty}
        isLoading={updateStatus.isPending}
        onClick={handleSave}
      >
        Update Status
      </Button>
    </div>
  );
}

export { OrderStatusChanger };
