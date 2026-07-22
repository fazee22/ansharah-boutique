"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Renders the global toast queue (`store/toast-store.ts`). Mounted
 * once in `app/layout.tsx`, positioned fixed bottom-center so it
 * never competes with the header's search overlay or mega menu for
 * screen space.
 */
function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((item) => {
          const Icon = ICONS[item.variant];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-md border px-4 py-3 shadow-elevated",
                item.variant === "success" && "border-brass/40 bg-ink text-porcelain",
                item.variant === "error" && "border-destructive/40 bg-destructive text-destructive-foreground",
                item.variant === "warning" && "border-amber-300 bg-amber-50 text-amber-900",
                item.variant === "info" && "border-evergreen/30 bg-evergreen text-porcelain",
                item.variant === "default" && "border-hairline bg-porcelain text-ink",
              )}
              role="status"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="text-body-sm">{item.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(item.id)}
                className="ml-1 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export { Toaster };
