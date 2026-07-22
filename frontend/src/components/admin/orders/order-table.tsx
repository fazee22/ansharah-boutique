"use client";

import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { OrderStatusBadge } from "./order-status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import type { AdminOrder } from "@/types/admin/order";

export interface OrderTableProps {
  orders: AdminOrder[];
  isLoading: boolean;
}

function OrderTable({ orders, isLoading }: OrderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
              Loading orders…
            </TableCell>
          </TableRow>
        ) : orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
              No orders match your filters.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={ROUTES.admin.orderDetail(order.id)}
                  className="font-mono text-body-sm text-ink hover:text-brass-dark"
                >
                  {order.orderNumber}
                </Link>
              </TableCell>
              <TableCell>
                <span className="flex flex-col">
                  <span className="text-body-sm text-ink">{order.customerName}</span>
                  <span className="text-caption text-muted-foreground">{order.customerEmail}</span>
                </span>
              </TableCell>
              <TableCell className="font-mono text-caption text-muted-foreground">{order.itemCount ?? "—"}</TableCell>
              <TableCell className="font-mono">{formatCurrency(order.total)}</TableCell>
              <TableCell className="text-caption capitalize text-muted-foreground">{order.paymentStatus}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-caption text-muted-foreground">
                {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric" })}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export { OrderTable };
