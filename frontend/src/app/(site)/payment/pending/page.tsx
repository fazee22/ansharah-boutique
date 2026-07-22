"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentStatusPage } from "@/components/payment/payment-status-page";

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  return <PaymentStatusPage variant="pending" orderNumber={searchParams.get("order")} />;
}

export default function PaymentPendingPage() {
  return (
    <Suspense>
      <PaymentPendingContent />
    </Suspense>
  );
}
