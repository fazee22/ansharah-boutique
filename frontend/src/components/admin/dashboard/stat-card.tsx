import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: number | string | null;
  icon: LucideIcon;
  tone?: "default" | "warning" | "danger";
  /** Shown instead of `value` when the underlying data doesn't exist yet (Orders/Customers/Revenue — Phase 7). */
  unavailableReason?: string;
}

const toneClass = {
  default: "text-ink",
  warning: "text-brass-dark",
  danger: "text-destructive",
};

/**
 * One dashboard metric tile. When `value` is `null`, renders an
 * honest "Available in Phase 7" state instead of a fabricated number
 * — see `DashboardService`'s class-level comment on the backend for
 * why Orders/Customers/Revenue can't be real yet.
 */
function StatCard({ label, value, icon: Icon, tone = "default", unavailableReason }: StatCardProps) {
  const isUnavailable = value === null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-caption uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", isUnavailable ? "text-muted-foreground/50" : toneClass[tone])} aria-hidden="true" />
      </div>
      {isUnavailable ? (
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-heading-md text-muted-foreground/50">—</span>
          <span className="text-caption text-muted-foreground">{unavailableReason ?? "Available in Phase 7"}</span>
        </div>
      ) : (
        <span className={cn("font-display text-display-sm font-light", toneClass[tone])}>{value}</span>
      )}
    </div>
  );
}

export { StatCard };
