"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Clock, PackageCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderLookupGate } from "./order-lookup-gate";
import { OrderSummaryCard } from "./order-summary-card";
import { useOrderLookup } from "@/hooks/use-order-lookup";
import { ROUTES } from "@/constants/routes";

export type PaymentStatusVariant = "confirmation" | "success" | "failed" | "pending";

export interface PaymentStatusPageProps {
  variant: PaymentStatusVariant;
  orderNumber: string | null;
}

const VARIANT_COPY: Record<PaymentStatusVariant, { icon: typeof CheckCircle2; eyebrow: string; title: string; message: string; tone: "success" | "danger" | "pending" }> = {
  confirmation: {
    icon: PackageCheck,
    eyebrow: "Order Placed",
    title: "Thank you for your order",
    message: "We've received your order and it's being prepared. A confirmation email is on its way.",
    tone: "success",
  },
  success: {
    icon: CheckCircle2,
    eyebrow: "Payment Successful",
    title: "Your payment went through",
    message: "Your order is confirmed and being prepared for dispatch.",
    tone: "success",
  },
  failed: {
    icon: XCircle,
    eyebrow: "Payment Failed",
    title: "We couldn't process your payment",
    message: "Your order hasn't been charged. You can try again or choose a different payment method.",
    tone: "danger",
  },
  pending: {
    icon: Clock,
    eyebrow: "Payment Pending",
    title: "Your payment is being confirmed",
    message: "This can take a few minutes for some payment methods. We'll update your order automatically once it clears.",
    tone: "pending",
  },
};

const TONE_CLASS = {
  success: "border-brass/30 bg-brass/10 text-brass-dark",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  pending: "border-evergreen/30 bg-evergreen/10 text-evergreen",
};

/**
 * One shared shell for all four payment-related landing pages — the
 * only thing that changes between `/order-confirmation`,
 * `/payment/success`, `/payment/failed`, and `/payment/pending` is
 * the icon/copy/tone above and, for `failed`, an extra "Try Again"
 * action. All four resolve the same way via `useOrderLookup`.
 */
function PaymentStatusPage({ variant, orderNumber }: PaymentStatusPageProps) {
  const { order, isLoading, needsEmail, submitEmail } = useOrderLookup(orderNumber);
  const copy = VARIANT_COPY[variant];
  const Icon = copy.icon;

  return (
    <Container width="narrow" className="flex flex-col gap-10 py-12 sm:py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className={`flex h-16 w-16 items-center justify-center rounded-full border ${TONE_CLASS[copy.tone]}`}>
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-overline uppercase tracking-widest text-muted-foreground">{copy.eyebrow}</span>
          <h1 className="font-display text-display-sm font-light text-foreground sm:text-display-md">{copy.title}</h1>
          <p className="mx-auto max-w-md text-body-sm text-muted-foreground">{copy.message}</p>
        </div>

        {orderNumber ? (
          <p className="font-mono text-caption text-muted-foreground">
            Order <span className="text-ink">{orderNumber}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {variant === "failed" && orderNumber ? (
            <Button asChild variant="primary" size="md">
              <Link href={`${ROUTES.paymentPending}?order=${orderNumber}`}>Try Again</Link>
            </Button>
          ) : null}
          <Button asChild variant={variant === "failed" ? "outline" : "primary"} size="md">
            <Link href={ROUTES.collections}>Continue Shopping</Link>
          </Button>
        </div>
      </div>

      {!orderNumber ? null : needsEmail ? (
        <OrderLookupGate orderNumber={orderNumber} onSubmit={submitEmail} />
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : order ? (
        <OrderSummaryCard order={order} showDownloadInvoice={variant !== "failed"} />
      ) : null}
    </Container>
  );
}

export { PaymentStatusPage };
