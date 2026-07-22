"use client";

import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/api/payment.service";
import { cn } from "@/lib/utils";
import type { PaymentGatewayKey } from "@/types/payment";

export interface PaymentMethodSelectorProps {
  value: PaymentGatewayKey | null;
  onChange: (gateway: PaymentGatewayKey) => void;
}

const ICONS: Record<PaymentGatewayKey, typeof CreditCard> = {
  stripe: CreditCard,
  jazzcash: Smartphone,
  easypaisa: Wallet,
  cod: Banknote,
};

/**
 * Reusable payment method picker — reads live from
 * `GET /api/v1/payments/methods`, so a gateway without real
 * credentials configured (see `config/payments.php`) shows up
 * visibly disabled rather than being hidden outright or silently
 * failing if picked. Not wired into a live checkout flow yet (see
 * PROJECT_MEMORY.md), but ready as the exact component that flow
 * would use.
 */
function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { data: methods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentService.methods(),
  });

  if (isLoading) {
    return <p className="text-caption text-muted-foreground">Loading payment methods…</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {(methods ?? []).map((method) => {
        const Icon = ICONS[method.key];
        const isSelected = value === method.key;
        return (
          <button
            key={method.key}
            type="button"
            disabled={!method.configured}
            onClick={() => onChange(method.key)}
            aria-pressed={isSelected}
            className={cn(
              "flex items-center gap-3 rounded-md border p-4 text-left transition-colors",
              isSelected ? "border-brass bg-brass/5" : "border-hairline hover:border-ink/30",
              !method.configured && "cursor-not-allowed opacity-40",
            )}
          >
            <Icon className="h-5 w-5 shrink-0 text-brass-dark" aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-body-sm text-ink">{method.label}</span>
              {!method.configured ? <span className="text-caption text-muted-foreground">Not available yet</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { PaymentMethodSelector };
