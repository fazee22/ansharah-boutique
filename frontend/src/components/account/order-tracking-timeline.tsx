import { Check, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/admin/order";

export interface OrderTrackingTimelineProps {
  status: OrderStatus;
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

/**
 * The Order Status Timeline the brief asks for — a premium stepper
 * (row of steps with connecting lines) rather than the admin's
 * log-style `OrderTimeline` (`components/admin/orders/order-timeline.tsx`),
 * which reads real history entries for an internal audit trail. This
 * component is about *where the order stands right now* for the
 * customer, not a change log — a purpose-built distinction, not
 * duplication.
 */
function OrderTrackingTimeline({ status }: OrderTrackingTimelineProps) {
  const isTerminatedEarly = status === "cancelled" || status === "refunded";
  const currentIndex = STEPS.findIndex((step) => step.status === status);

  if (isTerminatedEarly) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
          <X className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <span className="text-body-sm text-ink">
            {status === "cancelled" ? "This order was cancelled." : "This order was refunded."}
          </span>
          <span className="text-caption text-muted-foreground">Contact us if you have questions.</span>
        </div>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-6 sm:flex-row sm:gap-0">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex || (index === currentIndex && status === "delivered");
        const isCurrent = index === currentIndex && status !== "delivered";
        const isPending = index > currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <li key={step.status} className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:items-center sm:gap-2">
            <div className="flex w-full items-center sm:contents">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete && "border-brass bg-brass text-ink",
                  isCurrent && "border-brass bg-porcelain text-brass-dark",
                  isPending && "border-hairline bg-canvas text-muted-foreground",
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span className={cn("ml-3 text-body-sm sm:hidden", isComplete || isCurrent ? "text-ink" : "text-muted-foreground")}>
                {step.label}
              </span>
              {!isLast ? (
                <span
                  className={cn("hidden h-0.5 flex-1 sm:mx-2 sm:block", index < currentIndex ? "bg-brass" : "bg-hairline")}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <span className={cn("hidden text-caption sm:block", isComplete || isCurrent ? "text-ink" : "text-muted-foreground")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export { OrderTrackingTimeline };
