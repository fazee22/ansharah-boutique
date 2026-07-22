import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/admin/order";

const STATUS_STYLE: Record<OrderStatus, { label: string; variant: "brass" | "outline" | "ink" | "destructive" | "evergreen" }> = {
  pending: { label: "Pending", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "brass" },
  processing: { label: "Processing", variant: "brass" },
  shipped: { label: "Shipped", variant: "evergreen" },
  delivered: { label: "Delivered", variant: "evergreen" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  refunded: { label: "Refunded", variant: "ink" },
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLE[status];
  return <Badge variant={style.variant}>{style.label}</Badge>;
}

export { OrderStatusBadge, STATUS_STYLE };
