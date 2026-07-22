import { Circle } from "lucide-react";
import { OrderStatusBadge } from "./order-status-badge";
import { formatDate } from "@/lib/format";
import type { OrderStatusHistoryEntry } from "@/types/admin/order";

export interface OrderTimelineProps {
  history: OrderStatusHistoryEntry[];
}

/**
 * Reads `order_status_histories` (written automatically by
 * `OrderService::updateStatus()` on the backend) — never derived from
 * guesswork, so it stays accurate regardless of how many times an
 * order bounces between statuses.
 */
function OrderTimeline({ history }: OrderTimelineProps) {
  if (history.length === 0) {
    return <p className="text-caption text-muted-foreground">No status changes recorded yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-5">
      {history.map((entry, index) => (
        <li key={entry.id} className="relative flex gap-4 pl-1">
          <div className="flex flex-col items-center">
            <Circle
              className={index === 0 ? "h-3 w-3 fill-brass text-brass" : "h-3 w-3 fill-stone text-stone"}
              aria-hidden="true"
            />
            {index < history.length - 1 ? <div className="mt-1 w-px flex-1 bg-hairline" /> : null}
          </div>
          <div className="flex flex-1 flex-col gap-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={entry.status} />
              <span className="font-mono text-caption text-muted-foreground">
                {formatDate(entry.createdAt, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            {entry.note ? <p className="text-body-sm text-ink">{entry.note}</p> : null}
            {entry.changedByName ? (
              <span className="text-caption text-muted-foreground">by {entry.changedByName}</span>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export { OrderTimeline };
